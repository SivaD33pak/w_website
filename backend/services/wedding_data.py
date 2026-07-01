def get_events() -> list[dict[str, str]]:
    return [
        {
            "eventId": "wedding-ceremony",
            "eventName": "Holy Mass & Wedding Ceremony",
            "date": "2026-08-13",
            "time": "10:00 AM ONWARDS",
            "venue": "Sree Ragam Convention Centre",
        },
        {
            "eventId": "reception",
            "eventName": "Reception",
            "date": "2026-08-13",
            "time": "06:00 PM ONWARDS",
            "venue": "Sree Ragam Convention Centre",
        },
        {
            "eventId": "dinner",
            "eventName": "Dinner",
            "date": "2026-08-13",
            "time": "07:30 PM ONWARDS",
            "venue": "Sree Ragam Convention Centre",
        },
    ]


def get_gallery() -> list[dict[str, str]]:
    return [
        {
            "imageId": "gallery-bride",
            "title": "Bride Portrait",
            "imagePath": "https://storage.googleapis.com/banani-generated-images/generated-images/89485a65-8d3e-42aa-ae78-4c945e71b559.jpg",
        },
        {
            "imageId": "gallery-groom",
            "title": "Groom Portrait",
            "imagePath": "https://storage.googleapis.com/banani-generated-images/generated-images/09879492-06cb-4e45-8d15-980194817ffe.jpg",
        },
    ]
