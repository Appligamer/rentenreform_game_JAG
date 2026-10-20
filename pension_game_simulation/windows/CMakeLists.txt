cmake_minimum_required(VERSION 3.14)
project(pension_game_simulation LANGUAGES CXX)

set(BINARY_NAME "pension_game_simulation")

cmake_policy(SET CMP0079 NEW)

# Flutter Windows configuration
set(FLUTTER_MANAGED_DIR "${CMAKE_CURRENT_SOURCE_DIR}/flutter")

# Include the desktop runner
add_subdirectory("runner")

# Target configuration
add_executable(${BINARY_NAME} WIN32
  "runner/main.cpp"
  "runner/utils.cpp"
  "runner/win32_window.cpp"
  "runner/flutter_window.cpp"
  "runner/Runner.rc"
)

apply_standard_settings(${BINARY_NAME})
target_compile_features(${BINARY_NAME} PRIVATE cxx_std_17)
