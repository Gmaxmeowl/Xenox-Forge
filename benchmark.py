import time

num_scenes = 1000
scenes = []
for i in range(num_scenes):
    choices = []
    for j in range(2):
        choices.append({
            'id': f'c_{i}_{j}',
            'actions': [{'type': 'change_scene', 'targetId': f's_{(i+1)%num_scenes}'}]
        })
    scenes.append({
        'id': f's_{i}',
        'choices': choices,
        'position': {'x': i, 'y': i}
    })

def original_logic():
    edges = []
    for scene in scenes:
        for choice in (scene.get('choices') or []):
            for action in (choice.get('actions') or []):
                if action.get('type') == 'change_scene':
                    target = next((s for s in scenes if s['id'] == action.get('targetId')), None)
                    if target:
                        edges.append((scene['id'], target['id']))
    return edges

def optimized_logic():
    scene_map = {s['id']: s for s in scenes}
    edges = []
    for scene in scenes:
        for choice in (scene.get('choices') or []):
            for action in (choice.get('actions') or []):
                if action.get('type') == 'change_scene':
                    target = scene_map.get(action.get('targetId'))
                    if target:
                        edges.append((scene['id'], target['id']))
    return edges

# Warmup
original_logic()
optimized_logic()

start = time.time()
for _ in range(10): original_logic()
end = time.time()
print(f"Original (1000 scenes, 2000 edges, 10 iterations): {end - start:.4f}s")

start = time.time()
for _ in range(10): optimized_logic()
end = time.time()
print(f"Optimized (1000 scenes, 2000 edges, 10 iterations): {end - start:.4f}s")
