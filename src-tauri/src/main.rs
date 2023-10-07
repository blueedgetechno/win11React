#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use windows_sys::{
  Win32::System::Threading::*,
};

fn main() {
  unsafe {
    SetPriorityClass( GetCurrentProcess(), HIGH_PRIORITY_CLASS);
  }
  tauri::Builder::default()
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
