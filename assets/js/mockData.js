/**
 * Mock data to simulate API responses from Django backend
 * This structure matches expected Django API endpoints
 */
const mockData = {
  // Flights data (format matches Google Apps Script data structure used in original)
  flightsData: [
    // [Flight, Status, Current ETD/ETA, New ETD/ETA, Delay, New Orig/Dest, PAX, ADT, CHD, INF, ABLK]
    ["XO-387", "Diversion", "09:30/11:45", "13:30/16:15", "3h 45m", "ASE/RIL", "8", "6", "2", "0", "0"],
    ["XO-421", "Re-Dispatch", "15:30/17:45", "18:30/20:45", "2h 15m", "ASE/DEN", "10", "7", "2", "1", "0"],
    ["XO-293", "Cancellation", "07:00/09:15", "N/A", "N/A", "N/A", "6", "5", "1", "0", "0"]
  ],
  
  // Guests data
  guestsData: [
    // [Flight, Name, Last Comms, Ack]
    ["XO-387", "James Wilson", "Email - 15:42", "✓"],
    ["XO-387", "Sarah Johnson", "SMS - 15:30", "✓"],
    ["XO-421", "David Miller", "Call - 14:25", "!"],
    ["XO-421", "Jennifer Lee", "Email - 14:10", "!"]
  ],
  
  // Shuttle data
  shuttleData: {
    headers: ["To Rifle", "To Aspen"],
    data: [
      // [To Rifle, To Aspen] for each row
      ["16:00, 18:30", "17:30, 19:45"],
      ["Terminal A, Gate 5", "Terminal B, Gate 12"],
      ["Cloud Transfer", "Luxury Shuttles"],
      ["555-123-4567", "555-987-6543"],
      ["Frank Smith", "Amy Garcia"],
      ["555-111-2222", "555-333-4444"]
    ]
  },
  
  // Team actions data
  actionsData: [
    // [Action Item, Assigned To, Status]
    ["Coordinate hotel accommodations for XO-387", "OCC", "Complete"],
    ["Update catering orders for XO-421", "OCM", "Pending"],
    ["Arrange ground transportation for XO-293 passengers", "Concierge", "Incomplete"],
    ["Passenger communications regarding XO-387 diversion", "Experience", "Pending"],
    ["Aircraft maintenance check for N404AT", "Maintenance", "Incomplete"]
  ],
  
  // Team members data
  teamData: [
    // [Role, Member1, Member2, Member3]
    ["Exec", "David Thompson", "", ""],
    ["OCM", "Maria Rodriguez", "", ""],
    ["OCC", "John Smith", "Alice Jones", ""],
    ["Concierge", "Sandra Wilson", "", ""],
    ["Experience", "Michael Chen", "Lisa Park", ""],
    ["Digital/Tech", "Robert Lewis", "", ""],
    ["Finance", "Jennifer Wu", "", ""],
    ["Maintenance", "Thomas Rivera", "James Wilson", ""]
  ],
  
  // Jets data
  jetsData: [
    {
      reg: "N404AT",
      assignments: [
        {
          line1: "XO-387",
          line2: "ASE-RIL"
        }
      ]
    },
    {
      reg: "N402AT",
      assignments: [
        {
          line1: "XO-421",
          line2: "ASE-DEN"
        }
      ]
    },
    {
      reg: "N712AE",
      assignments: []
    },
    {
      reg: "N1023C",
      assignments: []
    },
    {
      reg: "N809TD",
      assignments: []
    }
  ]
};
