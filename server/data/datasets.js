export const INITIAL_DATASETS = [
  // 1. COMMERCIAL SHOPPING MALL
  {
    id: 'mall-galleria',
    name: 'Grand Horizon Retail Galleria & Mega-Mall',
    facilityType: 'Commercial Shopping Mall',
    filename: 'GH-MALL-LEVEL1-RETAIL-PLAN.dxf',
    fileType: 'dxf',
    dimensions: {
      width: 1400,
      height: 900,
      scaleLabel: '1:100 Metric (1mm = 100mm)',
      unit: 'mm',
      realWidthMm: 140000,
      realHeightMm: 90000,
    },
    specDocument: {
      title: 'IBC 2024 Chapter 4 (Covered Mall Buildings) & NFPA 101 Mall Egress Code',
      authority: 'International Code Council / NFPA Commercial Building Safety Committee',
      version: 'IBC-2024-MALL-CODE',
      summary: 'Mandatory spatial criteria for covered retail gallerias, maximum dead-end corridor lengths, smoke barrier fire shutter clearances, and occupant evacuation load sizing.'
    },
    storyNarrative: {
      summary: 'Bi-level commercial shopping mall featuring a central skylight atrium, two anchor department stores, 34 inline retail boutique units, a food court mezzanine, and service loading corridors.',
      spatialFlow: 'Primary shopper circulation revolves around a 12-meter wide central pedestrian concourse connecting North and South anchor stores. Secondary service corridors behind inline stores manage restocking and waste disposal away from public view.',
      safetyRisk: 'CRITICAL EVACUATION LIABILITY: The South Service Loading Concourse has a dead-end corridor measuring 18.5 meters (exceeding the strict 6.0 meter IBC code ceiling by over 200%). In a fire emergency, employees trapped in this corridor will encounter zero secondary egress exits.',
      logisticalEfficiency: 'Foot traffic distribution along the central atrium achieves 94% retail frontage visibility. However, promotional kiosk K-08 blocks the automatic rolling fire shutter descent path.',
      keyFindings: [
        'South Service Corridor dead-end length is 18.5 m (IBC §402.8 max allowed is 6.0 m).',
        'Promotional Kiosk K-08 encroaches into the designated 3,000 mm clear perimeter for Atrium Fire Shutter FS-02.',
        'Escalator Bank East clear discharge width is 1,600 mm (insufficient for calculated 1,450-shopper peak occupant load).'
      ]
    },
    defects: [
      {
        id: 'MALL-DEF-001',
        title: 'Dead-End Service Concourse Exceeds Maximum Permitted Length',
        discipline: 'LifeSafety',
        severity: 'CRITICAL',
        status: 'FLAGGED',
        specCode: 'IBC §402.8 / NFPA 101 §36.2.5.2',
        specRequirement: 'Dead-end corridors in covered mall buildings and back-of-house service corridors must not exceed 6,000 mm (20 feet).',
        actualMeasured: 'Actual measured dead-end travel length: 18,500 mm (60.7 feet)',
        deviation: '+12,500 mm (+208% beyond legal dead-end limit)',
        remediation: 'Knock out external wall panel at Axis G12 to install an emergency fire exit door EXIT-SC4 equipped with illuminated panic bar hardware.',
        storyNarrative: 'In the event of heavy smoke spread, retail workers and delivery staff running down the South Service corridor will be trapped in a blind dead-end without an exit.',
        boundingBox: { x: 920, y: 520, width: 280, height: 90 },
        targetLabel: 'SOUTH SERVICE LOADING CONCOURSE',
        layer: 'A-CORRIDOR',
        confidenceScore: 0.98,
        dimensionCallout: {
          x1: 940,
          y1: 565,
          x2: 1180,
          y2: 565,
          measuredLabel: '18.5 m DEAD-END (+12.5 m DEFICIT)',
          requiredLabel: 'IBC §402.8 MAX ALLOWED: ≤ 6.0 m',
          orientation: 'horizontal'
        }
      },
      {
        id: 'MALL-DEF-002',
        title: 'Retail Kiosk Encroaches on Automatic Fire Shutter Descent Zone',
        discipline: 'LifeSafety',
        severity: 'CRITICAL',
        status: 'FLAGGED',
        specCode: 'NFPA 80 Fire Doors & Shutters §6.3 / IBC §716',
        specRequirement: 'A minimum 3,000 mm completely unobstructed zone must be maintained on both sides of automatic overhead smoke-curtain/fire-shutter tracks.',
        actualMeasured: 'Promotional jewelry kiosk structure K-08 placed only 850 mm from shutter track',
        deviation: '-2,150 mm illegal obstruction of fire barrier',
        remediation: 'Relocate kiosk K-08 at least 3,500 mm northwards into central atrium open promenade.',
        storyNarrative: 'If fire alarms trigger, the heavy rolling fire shutter will strike the kiosk roof and fail to seal, allowing toxic smoke to surge into the upper shopping levels.',
        boundingBox: { x: 580, y: 340, width: 140, height: 100 },
        targetLabel: 'CENTRAL ATRIUM FIRE SHUTTER FS-02',
        layer: 'A-KIOSK',
        confidenceScore: 0.95,
        dimensionCallout: {
          x1: 590,
          y1: 390,
          x2: 635,
          y2: 390,
          measuredLabel: '850 mm CLEARANCE (-2,150 mm BLOCKED)',
          requiredLabel: 'NFPA 80 REQ: ≥ 3,000 mm ENVELOPE',
          orientation: 'horizontal'
        }
      },
      {
        id: 'MALL-DEF-003',
        title: 'Escalator Concourse Discharge Width Constricted',
        discipline: 'Accessibility',
        severity: 'MAJOR',
        status: 'FLAGGED',
        specCode: 'IBC §1005.3.2 Minimum Egress Width',
        specRequirement: 'Clear concourse width at escalator discharge points must provide at least 2,200 mm for calculated 1,450 occupant peak discharge.',
        actualMeasured: 'Measured bottleneck between tenant storefront and glass guardrail: 1,600 mm',
        deviation: '-600 mm (-27.3% crowd crush bottleneck)',
        remediation: 'Set back tenant storefront glazing line for Unit T-14 by 700 mm.',
        storyNarrative: 'During a mass evacuation or Black Friday crowd surge, descending shoppers stepping off the moving escalator will collide into stalled crowds at the bottleneck.',
        boundingBox: { x: 380, y: 190, width: 160, height: 120 },
        targetLabel: 'ESCALATOR DISCHARGE CONCOURSE EAST',
        layer: 'A-CIRC',
        confidenceScore: 0.92,
        dimensionCallout: {
          x1: 410,
          y1: 250,
          x2: 470,
          y2: 250,
          measuredLabel: '1,600 mm DISCHARGE (-600 mm BOTTLENECK)',
          requiredLabel: 'IBC 1005 REQ: ≥ 2,200 mm CLEAR',
          orientation: 'horizontal'
        }
      }
    ],
    specs: [
      {
        id: 'MALL-RULE-01',
        code: 'IBC-402.8-DEADEND',
        category: 'Mall Egress',
        title: 'Maximum Service Concourse Dead-End Length',
        requirement: 'Length ≤ 6,000 mm (20\'-0")',
        status: 'FAIL',
        matchedEntitiesCount: 4,
        threshold: '≤ 6,000 mm'
      },
      {
        id: 'MALL-RULE-02',
        code: 'NFPA-80-SHUTTER',
        category: 'Fire Barriers',
        title: 'Rolling Fire Shutter Clear Envelope',
        requirement: 'Unobstructed clearance ≥ 3,000 mm',
        status: 'FAIL',
        matchedEntitiesCount: 2,
        threshold: '≥ 3,000 mm'
      },
      {
        id: 'MALL-RULE-03',
        code: 'IBC-1005-CAPACITY',
        category: 'Crowd Flow',
        title: 'Escalator Discharge Minimum Concourse Width',
        requirement: 'Clear width ≥ 2,200 mm',
        status: 'FAIL',
        matchedEntitiesCount: 3,
        threshold: '≥ 2,200 mm'
      },
      {
        id: 'MALL-RULE-04',
        code: 'IBC-402.4-PROMENADE',
        category: 'Mall Architecture',
        title: 'Continuous Pedestrian Concourse Minimum Width',
        requirement: 'Clear width ≥ 6,000 mm throughout entire galleria',
        status: 'PASS',
        matchedEntitiesCount: 12,
        threshold: '≥ 6,000 mm'
      }
    ],
    cadEntities: [
      // Outer Mall Perimeter
      { id: 'm-w1', type: 'wall', layer: 'A-WALL', x: 100, y: 80, x2: 1300, y2: 80 },
      { id: 'm-w2', type: 'wall', layer: 'A-WALL', x: 1300, y: 80, x2: 1300, y2: 780 },
      { id: 'm-w3', type: 'wall', layer: 'A-WALL', x: 1300, y: 780, x2: 100, y2: 780 },
      { id: 'm-w4', type: 'wall', layer: 'A-WALL', x: 100, y: 780, x2: 100, y2: 80 },

      // Anchor Stores (North & South)
      { id: 'm-r1', type: 'room', layer: 'A-ROOM', x: 120, y: 100, width: 280, height: 660, label: 'ANCHOR DEPT STORE NORTH' },
      { id: 'm-r2', type: 'room', layer: 'A-ROOM', x: 1000, y: 100, width: 280, height: 400, label: 'ANCHOR DEPT STORE SOUTH' },

      // Retail Units along Promenade
      { id: 'm-u1', type: 'room', layer: 'A-ROOM', x: 440, y: 100, width: 140, height: 180, label: 'RETAIL T-11' },
      { id: 'm-u2', type: 'room', layer: 'A-ROOM', x: 600, y: 100, width: 140, height: 180, label: 'RETAIL T-12' },
      { id: 'm-u3', type: 'room', layer: 'A-ROOM', x: 760, y: 100, width: 160, height: 180, label: 'RETAIL T-14 (FASHION)' },
      { id: 'm-u4', type: 'room', layer: 'A-ROOM', x: 440, y: 500, width: 180, height: 260, label: 'FOOD COURT FOOD-HALL' },
      { id: 'm-u5', type: 'room', layer: 'A-ROOM', x: 640, y: 500, width: 240, height: 260, label: 'CINEMA MULTIPLEX' },

      // Central Concourse & Atrium
      { id: 'm-atr', type: 'room', layer: 'A-ROOM', x: 440, y: 300, width: 520, height: 180, label: 'CENTRAL ATRIUM & PROMENADE' },

      // Escalators
      { id: 'm-esc', type: 'escalator', layer: 'EQUIPMENT', x: 400, y: 220, width: 80, height: 50, label: 'ESCALATOR BANK EAST' },

      // Kiosk K-08
      { id: 'm-k08', type: 'equipment', layer: 'A-KIOSK', x: 610, y: 360, width: 70, height: 60, label: 'KIOSK K-08' },

      // Dead-End Service Corridor South
      { id: 'm-sc', type: 'corridor', layer: 'A-CORRIDOR', x: 940, y: 540, width: 240, height: 50, label: 'SERVICE CORRIDOR (DEAD-END)' }
    ]
  },

  // 2. FINE DINING RESTAURANT & COMMERCIAL KITCHEN
  {
    id: 'restaurant-bistro',
    name: 'Le Bistro Impérial & Culinary Kitchen',
    facilityType: 'Fine Dining Restaurant & Kitchen',
    filename: 'BISTRO-CHEF-KITCHEN-REV4.dxf',
    fileType: 'dxf',
    dimensions: {
      width: 1400,
      height: 900,
      scaleLabel: '1:50 Metric (1mm = 50mm)',
      unit: 'mm',
      realWidthMm: 70000,
      realHeightMm: 45000,
    },
    specDocument: {
      title: 'NFPA 96 Commercial Cooking Fire Protection & FDA 2022 Food Hygiene Code',
      authority: 'National Fire Protection Association / US FDA Food Safety Inspection',
      version: 'NFPA-96-CHEF-SPEC-2022',
      summary: 'Commercial cooking hood overhang clearances, grease duct separation, food preparation cross-contamination buffer distances, and ADA restaurant dining table aisle dimensions.'
    },
    storyNarrative: {
      summary: 'High-end 120-seat fine dining restaurant encompassing a luxury front-of-house dining salon, cocktail bar & lounge, walk-in cold rooms, and an open culinary exhibition cookline.',
      spatialFlow: 'Patrons enter through the front maître d\' station into the dining salon. Waitstaff circulate via a two-door swinging pantry into the commercial kitchen, where hot cooklines, plating passes, and scullery dishwashing operate in isolated quadrants.',
      safetyRisk: 'CRITICAL GREASE FIRE HAZARD: The Type-1 Commercial Range Exhaust Hood over the deep fryers and chargrill overhangs the appliance edge by only 50 mm (NFPA 96 mandates minimum 150 mm / 6 inches). Grease vapor and flame flare-ups risk escaping into the ceiling plenum, creating extreme fire hazard.',
      logisticalEfficiency: 'Waitstaff food-pickup cycle from the hot pass is under 18 seconds. However, the dining room table arrangement pinches ADA wheelchair pathways down to 720 mm (violating the 915 mm federal standard).',
      keyFindings: [
        'Type-1 Exhaust Hood overhang is 50 mm beyond open fryer battery (NFPA 96 §5.1 mandates ≥ 150 mm).',
        'Raw poultry prep sink is 450 mm from ready-to-eat vegetable prep table without impermeable splash shield.',
        'Dining Room Table Aisles between Banquettes B1-B4 measure 720 mm (ADA §403 mandates ≥ 915 mm).'
      ]
    },
    defects: [
      {
        id: 'REST-DEF-001',
        title: 'Commercial Range Hood Overhang Deficient Beyond Fryers',
        discipline: 'CommercialKitchen',
        severity: 'CRITICAL',
        status: 'FLAGGED',
        specCode: 'NFPA 96 §5.1.2.1 / International Mechanical Code §507',
        specRequirement: 'Type-1 exhaust hoods must overhang all cooking surfaces by at least 150 mm (6 inches) on all open sides to capture grease vapors.',
        actualMeasured: 'Hood overhang measures only 50 mm (2 inches) on East fryer edge',
        deviation: '-100 mm (-66.7% deficient capture envelope)',
        remediation: 'Extend stainless steel canopy hood C-01 eastward by 200 mm or install certified side grease skirts.',
        storyNarrative: 'Hot vaporized grease and oil droplets will bypass the exhaust filters and deposit on combustible ceiling tiles, risking a structural kitchen flashover fire.',
        boundingBox: { x: 720, y: 130, width: 240, height: 160 },
        targetLabel: 'COMMERCIAL COOKLINE TYPE-1 HOOD C-01',
        layer: 'M-HVAC',
        confidenceScore: 0.97,
        dimensionCallout: {
          x1: 890,
          y1: 220,
          x2: 930,
          y2: 220,
          measuredLabel: '50 mm OVERHANG (-100 mm DEFICIT)',
          requiredLabel: '≥ 150 mm (6") MANDATED BY NFPA 96',
          orientation: 'horizontal'
        }
      },
      {
        id: 'REST-DEF-002',
        title: 'Cross-Contamination Risk Between Raw Poultry & Produce Sinks',
        discipline: 'HealthSafety',
        severity: 'CRITICAL',
        status: 'FLAGGED',
        specCode: 'FDA Food Code §4-402 / Health Code Title 10',
        specRequirement: 'Raw meat/poultry preparation areas must maintain at least 1,200 mm physical separation or an impermeable 600 mm tall acrylic/stainless splash shield from clean produce prep.',
        actualMeasured: 'Direct open juxtaposition with only 450 mm clearance and zero barrier shield',
        deviation: '-750 mm distance deficit / missing sanitary partition',
        remediation: 'Install 600 mm tall stainless-steel sanitary divider plate between Sink SK-03 and SK-04.',
        storyNarrative: 'Water splash from rinsing raw chicken will cross-contaminate fresh salad greens with Salmonella and Campylobacter bacteria.',
        boundingBox: { x: 1000, y: 130, width: 250, height: 160 },
        targetLabel: 'FOOD PREPARATION SINK STATION SK-03 & SK-04',
        layer: 'A-PLUMB',
        confidenceScore: 0.94,
        dimensionCallout: {
          x1: 1060,
          y1: 200,
          x2: 1110,
          y2: 200,
          measuredLabel: '450 mm (-750 mm HAZARD)',
          requiredLabel: '≥ 1,200 mm OR 600mm SPLASH SHIELD',
          orientation: 'horizontal'
        }
      },
      {
        id: 'REST-DEF-003',
        title: 'Dining Room Table Aisle Width Fails ADA Wheelchair Access',
        discipline: 'Accessibility',
        severity: 'MAJOR',
        status: 'FLAGGED',
        specCode: 'ADA Standards §403 / ANSI A117.1 §902',
        specRequirement: 'Aisles between tables and fixed banquettes in restaurant dining areas must maintain minimum clear width of 915 mm (36 inches).',
        actualMeasured: 'Clear width between Table Cluster T-04 and T-08 measured at 720 mm',
        deviation: '-195 mm (-21.3% restricted wheelchair access)',
        remediation: 'Remove Table T-06 and space remaining tables to guarantee continuous 950 mm clear path to restrooms.',
        storyNarrative: 'Patrons using wheelchairs or walking canes cannot safely reach their tables or emergency exit doors without asking other guests to stand.',
        boundingBox: { x: 200, y: 460, width: 340, height: 220 },
        targetLabel: 'MAIN DINING SALON TABLE AISLES',
        layer: 'A-FURN',
        confidenceScore: 0.91,
        dimensionCallout: {
          x1: 260,
          y1: 535,
          x2: 320,
          y2: 535,
          measuredLabel: '720 mm AISLE (-195 mm DEFICIT)',
          requiredLabel: 'ADA MIN ≥ 915 mm (36" WHEELCHAIR)',
          orientation: 'horizontal'
        }
      }
    ],
    specs: [
      {
        id: 'REST-RULE-01',
        code: 'NFPA-96-HOOD',
        category: 'Fire Safety',
        title: 'Type-1 Commercial Kitchen Hood Overhang',
        requirement: 'Overhang ≥ 150 mm on open sides',
        status: 'FAIL',
        matchedEntitiesCount: 2,
        threshold: '≥ 150 mm'
      },
      {
        id: 'REST-RULE-02',
        code: 'FDA-FOOD-CODE',
        category: 'Sanitation',
        title: 'Raw Poultry to Produce Prep Separation',
        requirement: 'Distance ≥ 1,200 mm or Splash Shield Present',
        status: 'FAIL',
        matchedEntitiesCount: 3,
        threshold: '≥ 1,200 mm / Shield'
      },
      {
        id: 'REST-RULE-03',
        code: 'ADA-403-AISLE',
        category: 'Accessibility',
        title: 'Dining Room Table Aisle Clear Width',
        requirement: 'Clear width ≥ 915 mm (36 inches)',
        status: 'FAIL',
        matchedEntitiesCount: 8,
        threshold: '≥ 915 mm'
      },
      {
        id: 'REST-RULE-04',
        code: 'IMC-506-GREASE',
        category: 'Mechanical',
        title: 'Grease Duct Fire-Rated Shaft Enclosure',
        requirement: '2-hour fire rated shaft with cleanout access doors',
        status: 'PASS',
        matchedEntitiesCount: 1,
        threshold: '2-Hour Pass'
      }
    ],
    cadEntities: [
      { id: 'b-w1', type: 'wall', layer: 'A-WALL', x: 100, y: 80, x2: 1300, y2: 80 },
      { id: 'b-w2', type: 'wall', layer: 'A-WALL', x: 1300, y: 80, x2: 1300, y2: 780 },
      { id: 'b-w3', type: 'wall', layer: 'A-WALL', x: 1300, y: 780, x2: 100, y2: 780 },
      { id: 'b-w4', type: 'wall', layer: 'A-WALL', x: 100, y: 780, x2: 100, y2: 80 },

      // Partition separating Kitchen (Back of house) and Dining (Front of house)
      { id: 'b-w5', type: 'wall', layer: 'A-WALL', x: 680, y: 80, x2: 680, y2: 780 },

      // Dining Room & Bar
      { id: 'b-r1', type: 'room', layer: 'A-ROOM', x: 120, y: 100, width: 540, height: 280, label: 'COCKTAIL BAR & LOUNGE' },
      { id: 'b-r2', type: 'room', layer: 'A-ROOM', x: 120, y: 400, width: 540, height: 360, label: 'MAIN DINING SALON' },

      // Commercial Kitchen Rooms
      { id: 'b-r3', type: 'room', layer: 'A-ROOM', x: 700, y: 100, width: 280, height: 260, label: 'HOT COOKLINE & RANGE HOOD' },
      { id: 'b-r4', type: 'room', layer: 'A-ROOM', x: 1000, y: 100, width: 280, height: 260, label: 'FOOD PREP & VEGETABLE SINKS' },
      { id: 'b-r5', type: 'room', layer: 'A-ROOM', x: 700, y: 380, width: 280, height: 380, label: 'SCULLERY & DISHWASHING' },
      { id: 'b-r6', type: 'room', layer: 'A-ROOM', x: 1000, y: 380, width: 280, height: 380, label: 'WALK-IN COLD ROOMS (-18°C)' },

      // Cookline Equipment: Heavy Fryers & Type-1 Hood
      { id: 'b-fr', type: 'fryer', layer: 'EQUIPMENT', x: 745, y: 170, width: 145, height: 75, label: 'FRYERS & RANGE' },
      { id: 'b-hd', type: 'equipment', layer: 'M-HVAC', x: 735, y: 155, width: 195, height: 105, label: 'TYPE-1 CANOPY HOOD C-01' },

      // Sinks in Food Prep Room
      { id: 'b-sk3', type: 'sink', layer: 'A-PLUMB', x: 1010, y: 160, width: 50, height: 80, label: 'RAW POULTRY SINK SK-03', subDetails: 'CROSS-CONTAMINATION HAZARD' },
      { id: 'b-sk4', type: 'sink', layer: 'A-PLUMB', x: 1110, y: 160, width: 50, height: 80, label: 'PRODUCE SINK SK-04', subDetails: 'READY-TO-EAT GREENS' },

      // Dining Tables & Chairs
      { id: 't1', type: 'table', layer: 'A-FURN', x: 200, y: 480, width: 55, height: 55, label: 'TABLE T-01' },
      { id: 't2', type: 'table', layer: 'A-FURN', x: 320, y: 480, width: 55, height: 55, label: 'TABLE T-02' },
      { id: 't3', type: 'table', layer: 'A-FURN', x: 440, y: 480, width: 55, height: 55, label: 'TABLE T-03' },
      { id: 't4', type: 'table', layer: 'A-FURN', x: 200, y: 590, width: 55, height: 55, label: 'TABLE T-04' },
      { id: 't8', type: 'table', layer: 'A-FURN', x: 320, y: 590, width: 55, height: 55, label: 'TABLE T-08' },
      { id: 't6', type: 'table', layer: 'A-FURN', x: 440, y: 590, width: 55, height: 55, label: 'TABLE T-06' }
    ]
  },

  // 3. CORPORATE OFFICE TOWER
  {
    id: 'corporate-office',
    name: 'Nexus Financial Tower — Level 18 Executive Suite',
    facilityType: 'Corporate Office Tower',
    filename: 'NEXUS-TOWER-L18-OFFICE-PLAN.dxf',
    fileType: 'dxf',
    dimensions: {
      width: 1400,
      height: 900,
      scaleLabel: '1:75 Metric',
      unit: 'mm',
      realWidthMm: 105000,
      realHeightMm: 67500,
    },
    specDocument: {
      title: 'IBC 2024 Group B (Business) & OSHA 1910.36 Emergency Exit Egress Standards',
      authority: 'Occupational Safety and Health Administration / High-Rise Fire Safety Board',
      version: 'IBC-2024-GROUP-B',
      summary: 'Occupant load exit capacity, minimum separation of required exit stairwells, conference room exit door swing directions, and server room fire gas containment.'
    },
    storyNarrative: {
      summary: 'High-rise 18th floor corporate office floor plate comprising open workstation collaborative zones, 8 private executive suites, a 24-person executive boardroom, and a server data closet.',
      spatialFlow: 'Elevator core discharges into an open reception gallery. Perimeter perimeter windows house executive suites, while internal zones feature open desking pods and breakout collaboration booths.',
      safetyRisk: 'CRITICAL HIGH-RISE CODE VIOLATION: The executive boardroom (rated for 28 occupants) has an exit door swinging INWARD against the direction of emergency egress (IBC §1010.1.2.1 mandates outward swing for rooms with $\ge 50$ occupants or hazardous assembly). Additionally, the travel distance from southwest open desking to the nearest exit stair measures 76 meters (code limit is 60 meters).',
      logisticalEfficiency: 'Floor daylight penetration reaches 88% of all desks. Acoustic separation between conference rooms and open desking meets LEED v4 standards.',
      keyFindings: [
        'Boardroom D-18 exit door swings inward against the path of emergency egress.',
        'Travel distance from Southwest Desking Pod to Exit Stair A is 76.2 m (Code limit: 60.0 m without smoke dampers).',
        'ADA corridor width along Server Room corridor maintains full compliance at 1,820 mm.'
      ]
    },
    defects: [
      {
        id: 'OFF-DEF-001',
        title: 'Executive Boardroom Door Swings Inward Against Egress Path',
        discipline: 'LifeSafety',
        severity: 'CRITICAL',
        status: 'FLAGGED',
        specCode: 'IBC §1010.1.2.1 / NFPA 101 §7.2.1.4.2',
        specRequirement: 'Exit doors serving rooms with occupant load $\ge 20$ or assembly spaces must swing outward in the direction of emergency egress travel.',
        actualMeasured: 'Door D-18 configured with 90° inward swing into the conference room',
        deviation: 'Illegal inward door swing blocking egress',
        remediation: 'Reverse door hinge mounting to swing outward into circulation alcove with recessed threshold.',
        storyNarrative: 'In a fire evacuation, panicked occupants pressing against the door will trap the inward-swinging door leaf shut, causing lethal exit crush.',
        boundingBox: { x: 320, y: 460, width: 220, height: 160 },
        targetLabel: 'EXECUTIVE BOARDROOM 1802',
        layer: 'A-DOOR',
        confidenceScore: 0.96,
        dimensionCallout: {
          x1: 430,
          y1: 460,
          x2: 430,
          y2: 540,
          orientation: 'vertical',
          measuredLabel: 'INWARD SWING (90° BLOCKAGE)',
          requiredLabel: 'IBC §1010.1: OUTWARD SWING REQUIRED'
        }
      },
      {
        id: 'OFF-DEF-002',
        title: 'Travel Distance to Fire Exit Stairwell Exceeds 60m High-Rise Ceiling',
        discipline: 'LifeSafety',
        severity: 'CRITICAL',
        status: 'FLAGGED',
        specCode: 'IBC §1017.2 Exit Access Travel Distance',
        specRequirement: 'Maximum travel distance to certified pressurized fire stairwell must not exceed 60.0 meters (200 feet).',
        actualMeasured: 'Measured path of travel from Pod SW-04: 76.2 meters',
        deviation: '+16.2 m (+27.0% excessive egress journey)',
        remediation: 'Provide pressurized secondary egress vestibule connection to Core Stair B.',
        storyNarrative: 'Occupants during a high-rise fire condition cannot safely reach protected stair enclosure within allowable air quality times.',
        boundingBox: { x: 860, y: 480, width: 260, height: 220 },
        targetLabel: 'SOUTHWEST OPEN DESKING POD SW-04',
        layer: 'LIFE-SAFETY',
        confidenceScore: 0.93,
        dimensionCallout: {
          x1: 860,
          y1: 590,
          x2: 1120,
          y2: 590,
          orientation: 'horizontal',
          measuredLabel: '76.2 m TRAVEL (+16.2 m DEFICIT)',
          requiredLabel: 'IBC §1017 MAX: ≤ 60.0 m TRAVEL'
        }
      }
    ],
    specs: [
      {
        id: 'OFF-RULE-01',
        code: 'IBC-1010-SWING',
        category: 'Egress Doors',
        title: 'Conference Room Door Swing Direction',
        requirement: 'Outward swing in direction of travel',
        status: 'FAIL',
        matchedEntitiesCount: 2,
        threshold: 'Outward Swing'
      },
      {
        id: 'OFF-RULE-02',
        code: 'IBC-1017-TRAVEL',
        category: 'Egress Travel',
        title: 'Maximum Travel Distance to Exit Stair',
        requirement: 'Distance ≤ 60.0 m',
        status: 'FAIL',
        matchedEntitiesCount: 3,
        threshold: '≤ 60.0 m'
      },
      {
        id: 'OFF-RULE-03',
        code: 'ADA-404-WIDTH',
        category: 'Accessibility',
        title: 'Office Primary Corridor Width',
        requirement: 'Clear width ≥ 1,525 mm',
        status: 'PASS',
        matchedEntitiesCount: 6,
        threshold: '≥ 1,525 mm'
      }
    ],
    cadEntities: [
      { id: 'of-w1', type: 'wall', layer: 'A-WALL', x: 100, y: 80, x2: 1300, y2: 80 },
      { id: 'of-w2', type: 'wall', layer: 'A-WALL', x: 1300, y: 80, x2: 1300, y2: 780 },
      { id: 'of-w3', type: 'wall', layer: 'A-WALL', x: 1300, y: 780, x2: 100, y2: 780 },
      { id: 'of-w4', type: 'wall', layer: 'A-WALL', x: 100, y: 780, x2: 100, y2: 80 },

      // Central elevator core
      { id: 'of-cr', type: 'room', layer: 'A-ROOM', x: 540, y: 260, width: 320, height: 260, label: 'ELEVATOR & PRESSURIZED STAIR CORE' },

      // Boardroom
      { id: 'of-r1', type: 'room', layer: 'A-ROOM', x: 140, y: 440, width: 360, height: 300, label: 'EXECUTIVE BOARDROOM 1802' },

      // Open desking pods
      { id: 'of-r2', type: 'room', layer: 'A-ROOM', x: 140, y: 120, width: 360, height: 280, label: 'RECEPTION & COLLABORATION LOUNGE' },
      { id: 'of-r3', type: 'room', layer: 'A-ROOM', x: 900, y: 120, width: 360, height: 280, label: 'EXECUTIVE SUITES 1810-1815' },
      { id: 'of-r4', type: 'room', layer: 'A-ROOM', x: 900, y: 440, width: 360, height: 300, label: 'SOUTHWEST OPEN DESKING POD SW-04' }
    ]
  },

  // 4. HOSPITAL SURGICAL & ICU PAVILION
  {
    id: 'hospital-icu',
    name: 'St. Jude Level-4 Surgical & ICU Pavilion',
    facilityType: 'Hospital ICU & Surgical Wing',
    filename: 'STJ-ICU-LEVEL4-ARCH-REV3.dxf',
    fileType: 'dxf',
    dimensions: {
      width: 1400,
      height: 900,
      scaleLabel: '1:50 Metric (1mm = 50mm)',
      unit: 'mm',
      realWidthMm: 70000,
      realHeightMm: 45000,
    },
    specDocument: {
      title: 'FGI 2022 Healthcare Facilities & NFPA-101 Life Safety Code Specification',
      authority: 'Facility Guidelines Institute / NFPA Committee on Healthcare Occupancies',
      version: 'v4.2-2022-MANDATORY',
      summary: 'Mandatory clinical spatial standards for acute care intensive units, surgical corridors, radiation shielding, and airborne infection isolation rooms (AIIR).'
    },
    storyNarrative: {
      summary: 'Level 4 Critical Care Wing encompassing 12 Intensive Care cubicles, dual negative-pressure isolation suites, central nursing surveillance node, and sterile surgical transfer corridors.',
      spatialFlow: 'Primary patient triage moves west-to-east from trauma elevators directly into surgical prep. Sterile core circulation is meant to maintain strict unidirectional staff flow, while public family consultations remain sequestered at the south perimeter.',
      safetyRisk: 'HIGH CRITICAL EXPOSURE: The central transport corridor fails minimum width codes by 550mm, creating severe gurney collision bottlenecks during Code-Blue resuscitation transfers. Additionally, AIIR Suite #4 lacks an airlock anteroom, risking airborne droplet migration into general recovery.',
      logisticalEfficiency: 'Nurse travel radius to crash carts averages 11.4 meters (optimal <15m). However, medical gas manifold access in Pod C is constrained by structural column encroachment.',
      keyFindings: [
        'Corridor clearance violates FGI §2.1-3.2.2 (1,890mm actual vs 2,440mm mandated).',
        'Airborne Infection Isolation Room ICU-04 has direct egress without differential pressure airlock.',
        'CT Imaging Suite west partition contains only 1.2mm Pb lead equivalent (2.0mm required for 140kVp scanner).'
      ]
    },
    defects: [
      {
        id: 'DEF-001',
        title: 'Corridor Width Below Patient Transport Code',
        discipline: 'LifeSafety',
        severity: 'CRITICAL',
        status: 'FLAGGED',
        specCode: 'FGI §2.1-3.2.2 / NFPA 101 §18.2.3.4',
        specRequirement: 'Hospital patient transport corridors must maintain a minimum clear width of 2,440 mm (8\'-0") unobstructed between handrails and wall fixtures.',
        actualMeasured: 'Measured width: 1,890 mm (6\'-2.4") across Grid Axis C4-C7',
        deviation: '-550 mm (-22.5% below minimum code)',
        remediation: 'Relocate partition wall A-W14 southward by 600 mm into auxiliary storage to restore mandatory 2,440 mm clear gurney passage.',
        storyNarrative: 'During a Code Blue or rapid bariatric bed transfer, a 1,890 mm corridor prevents simultaneous passage of an emergency crash cart and medical gurney, directly violating life-safety egress standards.',
        boundingBox: { x: 420, y: 380, width: 340, height: 75 },
        targetLabel: 'MAIN PATIENT TRANSPORT CORRIDOR',
        layer: 'A-WALL',
        confidenceScore: 0.98,
        dimensionCallout: {
          x1: 580,
          y1: 380,
          x2: 580,
          y2: 455,
          measuredLabel: '1,890 mm CLEAR (-550 mm DEFICIT)',
          requiredLabel: 'FGI §2.1-3.2 REQ: ≥ 2,440 mm (8\'-0")',
          orientation: 'vertical'
        }
      },
      {
        id: 'DEF-002',
        title: 'Missing Anteroom Airlock on Airborne Infection Isolation Room',
        discipline: 'HealthcareEquipment',
        severity: 'CRITICAL',
        status: 'FLAGGED',
        specCode: 'CDC / FGI §2.1-2.4.2 AIIR Requirement',
        specRequirement: 'Negative-pressure isolation suites (AIIR) must feature an enclosed differential-pressure airlock anteroom (min 4.5 m²) between corridor and patient cubicle.',
        actualMeasured: 'Direct single-leaf door access without buffer anteroom',
        deviation: 'Anteroom omitted entirely in CAD layer A-DOOR',
        remediation: 'Reconfigure entrance vestibule to construct a 2.1m x 2.4m negative pressure airlock with interlocked door access control.',
        storyNarrative: 'Single-door access directly into general circulation exposes the entire unit to pathogen escape whenever room ICU-04 is opened, creating catastrophic airborne infection vulnerability.',
        boundingBox: { x: 810, y: 160, width: 160, height: 140 },
        targetLabel: 'ICU-04 (AIIR ISOLATION)',
        layer: 'A-ROOM',
        confidenceScore: 0.96,
        dimensionCallout: {
          x1: 890,
          y1: 350,
          x2: 890,
          y2: 290,
          measuredLabel: 'DIRECT DOOR (0 mm AIRLOCK)',
          requiredLabel: 'CDC: NEGATIVE AIRLOCK ANTEROOM REQ',
          orientation: 'vertical'
        }
      },
      {
        id: 'DEF-003',
        title: 'Substandard Radiation Shielding Lead Barrier in CT Suite',
        discipline: 'MEP',
        severity: 'CRITICAL',
        status: 'FLAGGED',
        specCode: 'NCRP Report 147 §4.2 / Structural Spec 134900',
        specRequirement: 'Partitions adjacent to 140 kVp helical CT scanner must incorporate min 2.0 mm Pb (5/64") lead shielding up to 2,100 mm height.',
        actualMeasured: 'Drywall partition specified with only 1.2 mm Pb sheet lining',
        deviation: '-0.8 mm Pb (-40% deficient radiation attenuation)',
        remediation: 'Upgrade specification sheet note note S-12 to specify dual-layer bonded lead sheet totaling 2.5 mm Pb equivalence with overlapping lead astragals at all joints.',
        storyNarrative: 'Staff charting in the adjacent nurse reading room will receive unshielded cumulative scatter radiation exceeding OSHA annual occupational dose limits.',
        boundingBox: { x: 190, y: 150, width: 180, height: 160 },
        targetLabel: 'CT RADIOLOGY & SCAN SUITE',
        layer: 'A-WALL-RAD',
        confidenceScore: 0.94,
        dimensionCallout: {
          x1: 360,
          y1: 180,
          x2: 380,
          y2: 180,
          measuredLabel: '1.2 mm Pb (-0.8 mm DEFICIT)',
          requiredLabel: 'NCRP 147 REQ: ≥ 2.0 mm Pb LEAD',
          orientation: 'horizontal'
        }
      }
    ],
    specs: [
      {
        id: 'RULE-01',
        code: 'FGI-2.1-3.2.2',
        category: 'Circulation & Egress',
        title: 'Minimum Corridor Width for Acute Care Units',
        requirement: 'Clear width ≥ 2,440 mm (8\'-0")',
        status: 'FAIL',
        matchedEntitiesCount: 3,
        threshold: '≥ 2,440 mm'
      },
      {
        id: 'RULE-02',
        code: 'CDC-AIIR-2022',
        category: 'Infection Control',
        title: 'Airborne Infection Isolation Anteroom Pressure Barrier',
        requirement: 'Enclosed negative airlock with self-closing interlock doors',
        status: 'FAIL',
        matchedEntitiesCount: 1,
        threshold: 'Airlock Present'
      },
      {
        id: 'RULE-03',
        code: 'NCRP-147-RAD',
        category: 'Radiation Protection',
        title: 'Diagnostic CT Room Lead Shielding Equivalence',
        requirement: 'Shielding thickness ≥ 2.0 mm Pb (5/64")',
        status: 'FAIL',
        matchedEntitiesCount: 4,
        threshold: '≥ 2.0 mm Pb'
      }
    ],
    cadEntities: [
      { id: 'w1', type: 'wall', layer: 'A-WALL', x: 100, y: 80, x2: 1300, y2: 80 },
      { id: 'w2', type: 'wall', layer: 'A-WALL', x: 1300, y: 80, x2: 1300, y2: 780 },
      { id: 'w3', type: 'wall', layer: 'A-WALL', x: 1300, y: 780, x2: 100, y2: 780 },
      { id: 'w4', type: 'wall', layer: 'A-WALL', x: 100, y: 780, x2: 100, y2: 80 },
      { id: 'w5', type: 'wall', layer: 'A-WALL', x: 380, y: 80, x2: 380, y2: 450 },
      { id: 'w6', type: 'wall', layer: 'A-WALL', x: 380, y: 520, x2: 380, y2: 780 },
      { id: 'w7', type: 'wall', layer: 'A-WALL', x: 760, y: 80, x2: 760, y2: 380 },
      { id: 'w8', type: 'wall', layer: 'A-WALL', x: 760, y: 455, x2: 760, y2: 780 },
      { id: 'w9', type: 'wall', layer: 'A-WALL', x: 420, y: 380, x2: 760, y2: 380 },
      { id: 'w10', type: 'wall', layer: 'A-WALL', x: 420, y: 455, x2: 760, y2: 455 },

      { id: 'r1', type: 'room', layer: 'A-ROOM', x: 120, y: 100, width: 240, height: 260, label: 'CT SCAN SUITE 101' },
      { id: 'r2', type: 'room', layer: 'A-ROOM', x: 120, y: 480, width: 240, height: 280, label: 'STERILE SURGICAL CORE' },
      { id: 'r3', type: 'room', layer: 'A-ROOM', x: 780, y: 100, width: 220, height: 260, label: 'ICU-04 (AIIR ISOLATION)' },
      { id: 'r4', type: 'room', layer: 'A-ROOM', x: 1020, y: 100, width: 260, height: 260, label: 'ICU-05 TRAUMA' },

      { id: 'e1', type: 'equipment', layer: 'E-EQUIP', x: 200, y: 200, width: 80, height: 80, label: 'CT GANTRY 140kVp' },
      { id: 'b1', type: 'bed', layer: 'A-FURN', x: 840, y: 180, width: 70, height: 110, label: 'BED 04' }
    ]
  },

  // 5. BIOPHARMA LOGISTICS WAREHOUSE
  {
    id: 'pharma-warehouse',
    name: 'Apex BioLogistics Central High-Bay Warehouse',
    facilityType: 'BioPharma Logistics Warehouse',
    filename: 'APEX-WH-LOGISTICS-SHEET-02.dxf',
    fileType: 'dxf',
    dimensions: {
      width: 1400,
      height: 900,
      scaleLabel: '1:100 Metric',
      unit: 'mm',
      realWidthMm: 140000,
      realHeightMm: 90000,
    },
    specDocument: {
      title: 'WHO GDP Annex 5 & OSHA 1910.22/1910.151 Warehouse Safety Specification',
      authority: 'World Health Organization / OSHA',
      version: 'Rev-2023.B',
      summary: 'Operational safety, forklift aisle clearances, emergency shower distances, and egress travel path constraints for pharmaceutical storage.'
    },
    storyNarrative: {
      summary: 'High-cube pharmaceutical distribution facility handling -80°C ultra-cold vaccines, hazardous solvent staging, and automated reach-truck palletizing.',
      spatialFlow: 'Material arrives via North receiving docks, undergoes quarantine sampling, then branches into cold-vault storage or automated ambient racking.',
      safetyRisk: 'CRITICAL LIFE SAFETY: High-bay forklift aisles have been compressed to 2,650mm (need 3,500mm). Eyewash access from battery charging area is 28m away (OSHA limit 16.8m).',
      logisticalEfficiency: 'Dock-to-vault transit is direct, but pallet staging blocks the main western fire egress route during peak staging operations.',
      keyFindings: [
        'Aisle width between Racks is 2,650 mm (Spec requires ≥ 3,500 mm).',
        'Chemical Battery Charging Bay eyewash station travel distance is 28.2 m (OSHA max 16.8 m).'
      ]
    },
    defects: [
      {
        id: 'WH-DEF-001',
        title: 'Forklift High-Bay Aisle Clearance Severely Restricted',
        discipline: 'LifeSafety',
        severity: 'CRITICAL',
        status: 'FLAGGED',
        specCode: 'OSHA 1910.176(a) / ANSI B56.1',
        specRequirement: 'Aisles where mechanical handling equipment operates must maintain minimum clear width of 3,500 mm.',
        actualMeasured: 'Clear width measured at 2,650 mm along Aisle B',
        deviation: '-850 mm (-24.2% hazardous pinch point)',
        remediation: 'Re-space Rack Rows westward by 900 mm to restore safe reach-truck turning envelope.',
        storyNarrative: 'Forklifts turning with loaded pallets will inevitably impact rack upright columns, causing catastrophic rack collapse.',
        boundingBox: { x: 490, y: 220, width: 230, height: 360 },
        targetLabel: 'HIGH-BAY AISLE B (RACKS 3 & 4)',
        layer: 'A-RACK',
        confidenceScore: 0.97,
        dimensionCallout: {
          x1: 490,
          y1: 400,
          x2: 720,
          y2: 400,
          orientation: 'horizontal',
          measuredLabel: '2,650 mm AISLE (-850 mm BOTTLENECK)',
          requiredLabel: 'OSHA 1910 REQ: ≥ 3,500 mm CLEAR'
        }
      }
    ],
    specs: [
      {
        id: 'WH-RULE-01',
        code: 'OSHA-1910.176',
        category: 'Material Handling',
        title: 'Mechanical Handling Equipment Aisle Clearance',
        requirement: 'Clear width ≥ 3,500 mm',
        status: 'FAIL',
        matchedEntitiesCount: 4,
        threshold: '≥ 3,500 mm'
      }
    ],
    cadEntities: [
      { id: 'wh-p1', type: 'wall', layer: 'A-WALL', x: 120, y: 100, x2: 1280, y2: 100 },
      { id: 'wh-p2', type: 'wall', layer: 'A-WALL', x: 1280, y: 100, x2: 1280, y2: 780 },
      { id: 'wh-p3', type: 'wall', layer: 'A-WALL', x: 1280, y: 780, x2: 120, y2: 780 },
      { id: 'wh-p4', type: 'wall', layer: 'A-WALL', x: 120, y: 780, x2: 120, y2: 100 }
    ]
  }
];

export const INITIAL_TRAINING_SAMPLES = [
  // Kaggle Floor Plan Datasets
  {
    id: 'TR-KAG-01',
    blueprintName: 'Kaggle: CVC-FP Floor Plan Semantic Benchmark',
    specName: 'IBC 2024 International Building Code & Architectural Standards',
    annotatedDefectsCount: 120,
    status: 'ground_truth',
    verifiedAccuracy: 0.96,
    source: 'Kaggle: CVC-FP',
    domain: 'Commercial & Retail',
    description: 'Pixel-level semantic segmentation vectors for rooms, structural walls, corridors, and partition boundaries across 120 commercial floor plans.'
  },
  {
    id: 'TR-KAG-02',
    blueprintName: 'Kaggle: FloorPlans-500 Architectural Object Detection',
    specName: 'NFPA 101 Life Safety Egress Doors & Hazard Enclosures',
    annotatedDefectsCount: 500,
    status: 'ground_truth',
    verifiedAccuracy: 0.97,
    source: 'Kaggle: FloorPlans-500',
    domain: 'Commercial & Retail',
    description: 'YOLO & COCO format bounding box annotations for doors, emergency exits, retail kiosks, stairs, and escalators in covered malls.'
  },
  {
    id: 'TR-KAG-03',
    blueprintName: 'Kaggle: Tell2Design Multimodal Spatial Constraints',
    specName: 'NFPA 96 Commercial Kitchen & ADA Restaurant Accessibility',
    annotatedDefectsCount: 340,
    status: 'ground_truth',
    verifiedAccuracy: 0.94,
    source: 'Kaggle: Tell2Design',
    domain: 'Restaurants & Kitchens',
    description: 'Natural language spatial specification clauses paired with 2D floor plans for dining rooms, commercial cooklines, and table aisle clearances.'
  },
  {
    id: 'TR-CUBI-04',
    blueprintName: 'CubiCasa5k Massive Architectural Vector Dataset',
    specName: 'Universal Building Codes, Room Area Minima & Egress Paths',
    annotatedDefectsCount: 5000,
    status: 'ground_truth',
    verifiedAccuracy: 0.98,
    source: 'CubiCasa5k-Vector',
    domain: 'Residential',
    description: '5,000+ vector-backed floor plans complete with 80+ architectural token classes (walls, door swings, plumbing fixtures, corridors).'
  },
  {
    id: 'TR-MALL-05',
    blueprintName: 'Grand Horizon Retail Galleria & Mall (GH-MALL-L1.dxf)',
    specName: 'IBC Chapter 4 Covered Mall Buildings & Atrium Egress',
    annotatedDefectsCount: 3,
    status: 'ground_truth',
    verifiedAccuracy: 0.95,
    source: 'Benchmark-GroundTruth',
    domain: 'Commercial & Retail',
    description: 'Dead-end service concourse violations, rolling fire shutter clearance envelopes, and escalator discharge concourse dimensions.'
  },
  {
    id: 'TR-REST-06',
    blueprintName: 'Le Bistro Impérial Fine Dining & Kitchen (BISTRO-REV4.dxf)',
    specName: 'NFPA 96 Range Hood Overhang & FDA Food Code Sanitation',
    annotatedDefectsCount: 3,
    status: 'ground_truth',
    verifiedAccuracy: 0.96,
    source: 'Benchmark-GroundTruth',
    domain: 'Restaurants & Kitchens',
    description: 'Commercial cooking hood overhang deficits, raw meat vs salad cross-contamination proximity, and ADA dining table aisle clearance.'
  },
  {
    id: 'TR-OFF-07',
    blueprintName: 'Nexus Corporate Headquarters Tower (NEXUS-L18.dxf)',
    specName: 'IBC Group B Business Occupancy & OSHA 1910 Egress',
    annotatedDefectsCount: 2,
    status: 'ground_truth',
    verifiedAccuracy: 0.94,
    source: 'Benchmark-GroundTruth',
    domain: 'Offices & Corporate',
    description: 'Conference room inward-swinging door egress hazard and high-rise exit travel distance ceiling exceedance.'
  },
  {
    id: 'TR-HC-08',
    blueprintName: 'St. Jude Level-4 Surgical Pavilion (STJ-ICU-REV3.dxf)',
    specName: 'FGI 2022 Healthcare Guidelines & NFPA-101 Life Safety Code',
    annotatedDefectsCount: 5,
    status: 'ground_truth',
    verifiedAccuracy: 0.96,
    source: 'Benchmark-GroundTruth',
    domain: 'Healthcare',
    description: 'Corridor width below gurney transport code, missing AIIR negative pressure airlock, and CT radiation lead shielding deficits.'
  }
];
