# vault_loader.py – Loads glass_cards and core_memory anchors

import os
import json

# Global stores
glass_card_memory = {}
core_memory_store = {}

def load_json_folder(folder_path, type_filter=None):
    memory = {}
    if not os.path.exists(folder_path):
        print(f"⚠️ Folder not found: {folder_path}")
        return memory

    for file in os.listdir(folder_path):
        if file.endswith(".json"):
            try:
                with open(os.path.join(folder_path, file), "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if not type_filter or data.get("type") == type_filter:
                        memory[data.get("name", file)] = data
            except Exception as e:
                print(f"⚠️ Failed to load {file}: {e}")
    return memory

def vault_loader(project_root):
    global glass_card_memory, core_memory_store

    glass_card_path = os.path.join(project_root, "glass_cards")
    core_memory_path = os.path.join(project_root, "core_memory")

    glass_card_memory = load_json_folder(glass_card_path, type_filter="identity")
    core_memory_store = load_json_folder(core_memory_path)

    print(f"✅ Loaded {len(glass_card_memory)} glass cards.")
    print(f"✅ Loaded {len(core_memory_store)} core memory scrolls.")
