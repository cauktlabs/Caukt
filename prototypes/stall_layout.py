"""stall placement generator."""

def spacing():
    return [320, 280, 360, 240]


def positions(start, count):
    pattern = spacing()
    result, cursor = [], start
    for i in range(count):
        result.append(cursor)
        cursor += pattern[i % len(pattern)]
    return result


def steam_slots(indexes):
    return [i for i in indexes if i % 3 == 2]
