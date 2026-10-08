/** Plain-language orientation grounded in the supplied prospectuses and official MSU-IIT program descriptions.
 * Stable explanations live here. Program facts and actual work remain CMS-authoritative.
 * Sources and editorial boundaries: docs/homepage-orientation.md.
 */
export const homeOrientation = {
  tagline: "Where Computing Meets the Physical World",
  positioningNote: "Proposed departmental positioning — to be validated by the Department.",
  specializations: [
    { title: "Embedded Systems and Microcontrollers", text: "Build small computers into devices to read sensors and control physical equipment." },
    { title: "Embedded Software and Firmware", text: "Write the software that runs inside a device and controls its behavior." },
    { title: "Internet of Things and Connected Systems", text: "Connect devices so they can exchange information with other devices and applications." },
    { title: "Edge Intelligence and Artificial Intelligence of Things (AIoT)", text: "Process information near a device; combine connected devices with AI when the task calls for it." },
  ],
  description: "Explore BSCA, MSCA and published research at the Department of Computer Applications, MSU-IIT, Philippines: software, firmware, embedded and connected systems.",
  meaning: "Computer Applications connects computing with the physical world. Students learn to write programs that read sensors, control devices, communicate with equipment and process real-world data. Software, device-control software (firmware), electronic hardware and networks work together in these systems.",
  flow: [
    { title: "Sense the world", term: "Sensors and devices", text: "Measure conditions such as temperature or movement." },
    { title: "Read the signals", term: "Microcontrollers", text: "Small computers inside devices receive sensor readings." },
    { title: "Control the device", term: "Firmware", text: "Software running on the device tells it what to do." },
    { title: "Process the readings", term: "Processing", text: "The device interprets readings, for example to decide whether a temperature is too high." },
    { title: "Use the information", term: "Application or connected system", text: "Display a reading or act on it locally; a network can optionally share it with another system." },
  ],
  builds: [
    { title: "Monitoring systems", text: "Read sensors to monitor conditions in farms, environments or equipment." },
    { title: "Connected and controlled devices", text: "Link equipment to an application or dashboard, and send commands to it." },
    { title: "Embedded and intelligent systems", text: "Build computing into a device for a specific task, such as detecting a condition and responding." },
  ],
  interests: ["Writing programs and understanding how they work", "Building and experimenting with sensors and devices", "Solving practical problems by combining software and hardware"],
  comparisons: [
    { title: "BS Computer Applications (BSCA)", text: "Computing applied to devices: firmware, embedded systems, connected equipment and IoT." },
    { title: "BS Computer Science (BSCS)", text: "Computing foundations and the design and development of software and computing systems." },
    { title: "BS Information Technology (BSIT)", text: "Developing applications and implementing and managing information technology and data infrastructure." },
    { title: "BS Information Systems (BSIS)", text: "Using information systems to support organizational and business needs." },
    { title: "BS Computer Engineering (BSCpE)", text: "Engineering the hardware and software components of computing systems and computer-controlled equipment." },
  ],
  directions: ["Embedded systems and firmware development", "IoT systems and hardware–software integration", "Software development, automation, and research and development"],
};
