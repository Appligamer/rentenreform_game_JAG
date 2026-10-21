import struct

def create_windows_exe(output_filename="START_GAME_WINDOWS.exe"):
    # Target: 32-bit Windows PE GUI executable that executes:
    # cmd.exe /c start_game_windows.bat
    
    image_base = 0x00400000
    section_alignment = 0x1000
    file_alignment = 0x200
    
    # 1. DOS Header
    dos_header = bytearray(64)
    dos_header[0:2] = b'MZ'
    struct.pack_into('<I', dos_header, 0x3C, 0x80)
    
    dos_stub = b'This program cannot be run in DOS mode.\r\r\n$\0\0\0\0\0\0\0'.ljust(64, b'\0')
    pe_sig = b'PE\0\0'
    
    # 2. COFF Header (20 bytes)
    coff_header = struct.pack(
        '<HHIIIHH',
        0x014c, # i386
        1,      # 1 section (.text)
        0,      # Timestamp
        0,      # PointerToSymbolTable
        0,      # NumberOfSymbols
        224,    # SizeOfOptionalHeader
        0x0102  # EXECUTABLE_IMAGE | 32BIT_MACHINE
    )
    
    # 3. Optional Header (96 bytes standard/windows fields + 128 bytes data directories = 224 bytes)
    # Magic (0x10b = PE32)
    entry_point = 0x1000
    size_of_code = 0x200
    size_of_image = 0x2000
    size_of_headers = 0x200
    
    opt_fields = [
        0x010b, # Magic (H)
        1,      # MajorLinkerVersion (B)
        0,      # MinorLinkerVersion (B)
        size_of_code, # SizeOfCode (I)
        0,      # SizeOfInitializedData (I)
        0,      # SizeOfUninitializedData (I)
        entry_point, # AddressOfEntryPoint (I)
        0x1000, # BaseOfCode (I)
        0,      # BaseOfData (I)
        image_base, # ImageBase (I)
        section_alignment, # SectionAlignment (I)
        file_alignment,    # FileAlignment (I)
        4, 0,   # Major/MinorOperatingSystemVersion (HH)
        0, 0,   # Major/MinorImageVersion (HH)
        4, 0,   # Major/MinorSubsystemVersion (HH)
        0,      # Win32VersionValue (I)
        size_of_image, # SizeOfImage (I)
        size_of_headers, # SizeOfHeaders (I)
        0,      # CheckSum (I)
        2,      # Subsystem: 2 = Windows GUI (H)
        0,      # DllCharacteristics (H)
        0x100000, # SizeOfStackReserve (I)
        0x1000,   # SizeOfStackCommit (I)
        0x100000, # SizeOfHeapReserve (I)
        0x1000,   # SizeOfHeapCommit (I)
        0,        # LoaderFlags (I)
        16        # NumberOfRvaAndSizes (I)
    ]
    
    opt_fmt = '<HBBIIIIIIIIHHHHHHIIIIHHIIIIIII'
    opt_header = struct.pack(opt_fmt, *opt_fields)
    
    # Data Directories (16 entries * 8 bytes = 128 bytes)
    data_dirs = bytearray(128)
    import_rva = 0x1050
    import_size = 0x40
    struct.pack_into('<II', data_dirs, 8, import_rva, import_size) # Entry 1: Import Table
    
    # 4. Section Header (40 bytes)
    section_name = b'.text\0\0\0'
    section_header = struct.pack(
        '<8sIIIIIIHHI',
        section_name,
        0x200,      # VirtualSize
        0x1000,     # VirtualAddress (RVA)
        0x200,      # SizeOfRawData
        0x200,      # PointerToRawData
        0, 0,       # Relocations, LineNumbers
        0, 0,       # Counts
        0x60000020  # Characteristics: CODE | EXECUTE | READ
    )
    
    headers = dos_header + dos_stub + pe_sig + coff_header + opt_header + data_dirs + section_header
    headers = headers.ljust(file_alignment, b'\0')
    
    # 5. Section .text content (at file offset 0x200)
    text = bytearray(file_alignment)
    
    # String at offset 0x10 (RVA 0x1010)
    cmd_str = b'cmd.exe /c start_game_windows.bat\0'
    text[0x10:0x10+len(cmd_str)] = cmd_str
    
    # Assembly code at offset 0x00 (RVA 0x1000)
    # push 1 (SW_SHOWNORMAL)
    # push 0x00401010 (cmd_str)
    # call [0x004010A0] (WinExec)
    # push 0
    # call [0x004010A4] (ExitProcess)
    code = bytes([
        0x6A, 0x01,                         # push 1
        0x68, 0x10, 0x10, 0x40, 0x00,       # push 0x00401010
        0xFF, 0x15, 0xA0, 0x10, 0x40, 0x00, # call dword ptr [0x004010A0]
        0x6A, 0x00,                         # push 0
        0xFF, 0x15, 0xA4, 0x10, 0x40, 0x00  # call dword ptr [0x004010A4]
    ])
    text[0:len(code)] = code
    
    # Import Directory at offset 0x50 (RVA 0x1050)
    import_desc = struct.pack('<IIIII', 0x1070, 0, 0, 0x1080, 0x10A0)
    import_null = b'\0' * 20
    text[0x50:0x50+40] = import_desc + import_null
    
    # OriginalFirstThunk at offset 0x70 (RVA 0x1070)
    thunks = struct.pack('<III', 0x10B0, 0x10C0, 0)
    text[0x70:0x70+12] = thunks
    
    # FirstThunk (IAT) at offset 0xA0 (RVA 0x10A0)
    text[0xA0:0xA0+12] = thunks
    
    # DLL Name at offset 0x80 (RVA 0x1080)
    dll_name = b'KERNEL32.dll\0'
    text[0x80:0x80+len(dll_name)] = dll_name
    
    # Hint/Name table:
    # 0xB0: Hint (2 bytes 0) + 'WinExec\0'
    text[0xB0:0xB0+10] = b'\0\0WinExec\0'
    # 0xC0: Hint (2 bytes 0) + 'ExitProcess\0'
    text[0xC0:0xC0+14] = b'\0\0ExitProcess\0'
    
    pe_file = headers + text
    with open(output_filename, 'wb') as f:
        f.write(pe_file)
    print(f"Successfully generated {output_filename} ({len(pe_file)} bytes)")

if __name__ == '__main__':
    create_windows_exe()
