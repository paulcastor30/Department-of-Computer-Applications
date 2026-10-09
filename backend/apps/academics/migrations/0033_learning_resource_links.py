from django.db import migrations


RESOURCES = [
    dict(slug="circuit-basics", title="What is a Circuit?", topic="FOUNDATIONS", provider="SparkFun Learn", level="BEGINNER", start_here=True,
         url="https://learn.sparkfun.com/tutorials/what-is-a-circuit/all", resource_type="Article",
         description="Explore how an electrical circuit works before moving on to sensors and microcontrollers.",
         activity="Sketch a simple circuit and label its power source, connections, and load."),
    dict(slug="arduino-getting-started", title="Getting Started with Arduino", topic="EMBEDDED", provider="Arduino", level="BEGINNER", start_here=True,
         url="https://docs.arduino.cc/learn/starting-guide/getting-started-arduino/", resource_type="Reading guide",
         description="Get familiar with Arduino boards, programming tools, and the first steps of working with a microcontroller.",
         activity="Find a Blink example and explain what setup() and loop() do before trying it on a board."),
    dict(slug="mqtt-essentials", title="MQTT Essentials", topic="IOT", provider="HiveMQ", level="BEGINNER", start_here=True,
         url="https://www.hivemq.com/mqtt/", resource_type="Articles and tutorials",
         description="Learn how connected devices exchange messages through clients, a broker, and topics. Start with the MQTT basics section.",
         activity="Draw how a temperature sensor could publish a reading to a dashboard through an MQTT broker."),
    dict(slug="esp32-get-started", title="ESP32: Get Started with ESP-IDF", topic="IOT", provider="Espressif", level="INTERMEDIATE", start_here=False,
         url="https://docs.espressif.com/projects/esp-idf/en/stable/esp32/get-started/index.html", resource_type="Technical documentation",
         description="After practising basic programming, explore the development tools used to build and run firmware on an ESP32. Read the hardware and software requirements first.",
         activity="List the steps from setting up the development environment to building, flashing, and monitoring your first example."),
]


def add_resources(apps, schema_editor):
    Resource = apps.get_model("academics", "LearningResource")
    for index, resource in enumerate(RESOURCES):
        Resource.objects.using(schema_editor.connection.alias).get_or_create(
            slug=resource["slug"], defaults={
                **{key: value for key, value in resource.items() if key != "slug"},
                "sort_order": index, "is_published": True,
                "access_note": "Public reading; practical activities may require hardware or software. Check the provider for current access conditions.",
            }
        )


class Migration(migrations.Migration):
    dependencies = [("academics", "0032_learningresource")]
    operations = [migrations.RunPython(add_resources, migrations.RunPython.noop)]
