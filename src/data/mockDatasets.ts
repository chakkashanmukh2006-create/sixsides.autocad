import { BlueprintDataset, TrainingSample } from '../types';

export const INITIAL_DATASETS: BlueprintDataset[] = [
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
        confidenceScore: 0.98
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
        confidenceScore: 0.96
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
        confidenceScore: 0.94
      },
      {
        id: 'DEF-004',
        title: 'Surgical Scrub Sink Protrudes into Clean Corridor Clearance',
        discipline: 'Architectural',
        severity: 'MAJOR',
        status: 'FLAGGED',
        specCode: 'AIA Guidelines §7.2 / ADA §307.2',
        specRequirement: 'Wall-mounted scrub stations and alcoves must not encroach more than 100 mm into required clean corridor boundary.',
        actualMeasured: 'Scrub sink trough protrudes 420 mm into primary passage',
        deviation: '+320 mm illegal projection into pedestrian path',
        remediation: 'Recess scrub sink unit into 450 mm wall alcove cavity A-ALC-02.',
        storyNarrative: 'Sterile surgical staff scrubbing in are exposed to brushing contacts from passing supply carts, contaminating sterile field prep.',
        boundingBox: { x: 570, y: 270, width: 90, height: 60 },
        targetLabel: 'SCRUB STATION ALCOVE #2',
        layer: 'A-PLUMB',
        confidenceScore: 0.91
      },
      {
        id: 'DEF-005',
        title: 'Nurse Station Blindspot to Recovery Bed Bays 7 & 8',
        discipline: 'Architectural',
        severity: 'MINOR',
        status: 'FLAGGED',
        specCode: 'FGI §2.1-2.2.1 Visual Observation Standard',
        specRequirement: 'Direct uninterrupted visual line-of-sight required from central nursing post to all patient heads in intensive care pods.',
        actualMeasured: 'Sightline blocked by mechanical shaft chase M-04',
        deviation: '0% direct sightline from primary console',
        remediation: 'Install redundant decentralized telemetry video display or mirror station at sub-station Pod B.',
        storyNarrative: 'Unmonitored patient beds present delayed response risks during extubation emergencies.',
        boundingBox: { x: 1010, y: 440, width: 130, height: 110 },
        targetLabel: 'RECOVERY BAYS 7 & 8',
        layer: 'A-FURN',
        confidenceScore: 0.88
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
      },
      {
        id: 'RULE-04',
        code: 'ADA-307.2-PROTR',
        category: 'Accessibility & Safety',
        title: 'Wall Protruding Objects in Circulation Corridors',
        requirement: 'Maximum encroachment ≤ 100 mm (4")',
        status: 'FAIL',
        matchedEntitiesCount: 2,
        threshold: '≤ 100 mm'
      },
      {
        id: 'RULE-05',
        code: 'NFPA-99-MEDGAS',
        category: 'Medical Gas Systems',
        title: 'Zone Valve Box Clearance & Emergency Access',
        requirement: 'Unobstructed 900 mm front maintenance envelope',
        status: 'PASS',
        matchedEntitiesCount: 6,
        threshold: '≥ 900 mm'
      },
      {
        id: 'RULE-06',
        code: 'FGI-2.1-3.1.5',
        category: 'Sterile Core Integrity',
        title: 'Positive Pressure Airflow Gradient into OR Theaters',
        requirement: 'Class 10,000 ISO 7 filtration with sealed perimeter seals',
        status: 'PASS',
        matchedEntitiesCount: 8,
        threshold: 'ISO 7 Pass'
      }
    ],
    cadEntities: [
      // Outer perimeter walls
      { id: 'w1', type: 'wall', layer: 'A-WALL', x: 100, y: 80, x2: 1300, y2: 80 },
      { id: 'w2', type: 'wall', layer: 'A-WALL', x: 1300, y: 80, x2: 1300, y2: 780 },
      { id: 'w3', type: 'wall', layer: 'A-WALL', x: 1300, y: 780, x2: 100, y2: 780 },
      { id: 'w4', type: 'wall', layer: 'A-WALL', x: 100, y: 780, x2: 100, y2: 80 },
      
      // Corridors & partitions
      { id: 'w5', type: 'wall', layer: 'A-WALL', x: 380, y: 80, x2: 380, y2: 450 },
      { id: 'w6', type: 'wall', layer: 'A-WALL', x: 380, y: 520, x2: 380, y2: 780 },
      { id: 'w7', type: 'wall', layer: 'A-WALL', x: 760, y: 80, x2: 760, y2: 380 },
      { id: 'w8', type: 'wall', layer: 'A-WALL', x: 760, y: 455, x2: 760, y2: 780 },
      
      // Narrow Corridor violation zone
      { id: 'w9', type: 'wall', layer: 'A-WALL', x: 420, y: 380, x2: 760, y2: 380 },
      { id: 'w10', type: 'wall', layer: 'A-WALL', x: 420, y: 455, x2: 760, y2: 455 },

      // Rooms
      { id: 'r1', type: 'room', layer: 'A-ROOM', x: 120, y: 100, width: 240, height: 260, label: 'CT SCAN SUITE 101' },
      { id: 'r2', type: 'room', layer: 'A-ROOM', x: 120, y: 480, width: 240, height: 280, label: 'STERILE SURGICAL CORE' },
      { id: 'r3', type: 'room', layer: 'A-ROOM', x: 780, y: 100, width: 220, height: 260, label: 'ICU-04 (AIIR ISOLATION)' },
      { id: 'r4', type: 'room', layer: 'A-ROOM', x: 1020, y: 100, width: 260, height: 260, label: 'ICU-05 TRAUMA' },
      { id: 'r5', type: 'room', layer: 'A-ROOM', x: 780, y: 480, width: 220, height: 280, label: 'NURSE MONITORING HUB' },
      { id: 'r6', type: 'room', layer: 'A-ROOM', x: 1020, y: 480, width: 260, height: 280, label: 'RECOVERY BEDS 7 & 8' },

      // Medical equipment & beds
      { id: 'e1', type: 'equipment', layer: 'E-EQUIP', x: 200, y: 200, width: 80, height: 80, label: 'CT GANTRY 140kVp' },
      { id: 'b1', type: 'bed', layer: 'A-FURN', x: 840, y: 180, width: 70, height: 110, label: 'BED 04' },
      { id: 'b2', type: 'bed', layer: 'A-FURN', x: 1080, y: 180, width: 70, height: 110, label: 'BED 05' },
      { id: 'b3', type: 'bed', layer: 'A-FURN', x: 1050, y: 560, width: 60, height: 90, label: 'BED 07' },
      { id: 'b4', type: 'bed', layer: 'A-FURN', x: 1180, y: 560, width: 60, height: 90, label: 'BED 08' },

      // Doors
      { id: 'd1', type: 'door', layer: 'A-DOOR', x: 380, y: 470, width: 30, height: 30, rotation: 90, label: 'D-101' },
      { id: 'd2', type: 'door', layer: 'A-DOOR', x: 760, y: 400, width: 30, height: 30, rotation: 90, label: 'D-102' },
      { id: 'd3', type: 'door', layer: 'A-DOOR', x: 880, y: 360, width: 30, height: 30, rotation: 0, label: 'D-ICU4' }
    ]
  },
  {
    id: 'pharma-warehouse',
    name: 'Apex BioLogistics Central High-Bay Warehouse',
    facilityType: 'BioPharma Logistics Warehouse',
    filename: 'APEX-WH-LOGISTICS-SHEET-02.dxf',
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
      title: 'WHO GDP Annex 5 & OSHA 1910.22/1910.151 Warehouse Safety Specification',
      authority: 'World Health Organization / US Occupational Safety and Health Administration',
      version: 'Rev-2023.B',
      summary: 'Operational safety, cold-chain integrity, high-bay forklift aisle clearances, emergency shower distances, and egress travel path constraints for pharmaceutical storage.'
    },
    storyNarrative: {
      summary: 'High-cube pharmaceutical distribution facility handling -80°C ultra-cold vaccines, hazardous medical solvent staging, and automated reach-truck palletizing.',
      spatialFlow: 'Material arrives via North receiving docks, undergoes quarantine sampling in Bay 1, then branches into either cold-vault storage or automated ambient racking before outbound packaging at South docks.',
      safetyRisk: 'CRITICAL LIFE SAFETY & COMPLIANCE DEFICIT: High-bay forklift aisles have been compressed to 2,650mm, which creates immediate crush and racking impact hazards for standard 3,500mm counter-balance forklifts. Emergency eyewash access from the battery charging area exceeds maximum travel distance by 66%.',
      logisticalEfficiency: 'Dock-to-vault transit is direct (average 42 seconds cycle time), but pallet staging blocks the main western fire egress route during peak staging operations.',
      keyFindings: [
        'Aisle width between Racks R-03 and R-04 is 2,650 mm (Spec requires ≥ 3,500 mm).',
        'Chemical Battery Charging Bay eyewash station travel distance is 28.2 m (OSHA max 16.8 m / 55 ft).',
        'Maximum fire travel distance from Deep Freeze Vault to Exit NW is 78.4 m (NFPA 101 ceiling is 60 m).'
      ]
    },
    defects: [
      {
        id: 'WH-DEF-001',
        title: 'Forklift High-Bay Aisle Clearance Severely Restricted',
        discipline: 'LifeSafety',
        severity: 'CRITICAL',
        status: 'FLAGGED',
        specCode: 'OSHA 1910.176(a) / ANSI B56.1 Racking Clearance',
        specRequirement: 'Aisles where mechanical handling equipment operates must maintain minimum clear width of 3,500 mm (or truck turn radius + 600 mm buffer).',
        actualMeasured: 'Clear width measured at 2,650 mm along Aisle B',
        deviation: '-850 mm (-24.2% hazardous pinch point)',
        remediation: 'Re-space Rack Rows R-03 and R-04 westward by 900 mm or mandate wire-guided VNA (Very Narrow Aisle) turrets exclusively.',
        storyNarrative: 'Standard counterbalance forklifts turning with loaded 1,200x1,000 mm Euro-pallets will inevitably impact rack upright columns, causing structural rack collapse risks.',
        boundingBox: { x: 490, y: 220, width: 230, height: 360 },
        targetLabel: 'HIGH-BAY AISLE B (RACKS 3 & 4)',
        layer: 'A-RACK',
        confidenceScore: 0.97
      },
      {
        id: 'WH-DEF-002',
        title: 'Emergency Eyewash & Drench Shower Exceeds Travel Distance Limit',
        discipline: 'LifeSafety',
        severity: 'MAJOR',
        status: 'FLAGGED',
        specCode: 'OSHA 1910.151(c) / ANSI Z358.1 §5.5.2',
        specRequirement: 'Eyewash stations in hazardous battery charging & electrolyte zones must be accessible within 10 seconds unobstructed travel (≤ 16.8 m / 55 ft).',
        actualMeasured: 'Measured travel distance: 28.2 meters to station EW-01',
        deviation: '+11.4 m (+67.8% beyond legal safety threshold)',
        remediation: 'Install dedicated plumbed emergency eyewash pedestal directly at Column Grid F-12 within 10 meters of battery charging bench.',
        storyNarrative: 'An employee splashed with corrosive battery acid or toxic solvent cannot reach decontamination within the critical 10-second chemical burn window.',
        boundingBox: { x: 180, y: 560, width: 190, height: 160 },
        targetLabel: 'BATTERY CHARGING & CHEMICAL BAY',
        layer: 'M-PLUMB',
        confidenceScore: 0.95
      },
      {
        id: 'WH-DEF-003',
        title: 'Fire Egress Travel Distance Exceeds Code Limit from Cold Vault',
        discipline: 'LifeSafety',
        severity: 'CRITICAL',
        status: 'FLAGGED',
        specCode: 'NFPA 101 §40.2.6 Industrial Occupancy',
        specRequirement: 'Maximum common path of travel to nearest emergency exit in industrial storage must not exceed 60 meters (200 ft).',
        actualMeasured: 'Actual egress path length: 78.4 meters through staging corridor',
        deviation: '+18.4 m (+30.6% excessive egress journey)',
        remediation: 'Knock out external precast panel on West Wall to install illuminated emergency exit door EXIT-W3 with panic hardware.',
        storyNarrative: 'Workers in the -80°C deep freeze vault trapped by an aisle fire cannot safely escape within allowable smoke clearance margins.',
        boundingBox: { x: 880, y: 140, width: 280, height: 260 },
        targetLabel: '-80°C ULTRA-COLD VAULT',
        layer: 'LIFE-SAFETY',
        confidenceScore: 0.93
      }
    ],
    specs: [
      {
        id: 'WH-RULE-01',
        code: 'OSHA-1910.176',
        category: 'Material Handling',
        title: 'Mechanical Handling Equipment Aisle Clearance',
        requirement: 'Clear width ≥ 3,500 mm for dual-way reach trucks',
        status: 'FAIL',
        matchedEntitiesCount: 4,
        threshold: '≥ 3,500 mm'
      },
      {
        id: 'WH-RULE-02',
        code: 'ANSI-Z358.1',
        category: 'Hazardous Chemical',
        title: 'Emergency Shower & Eyewash Maximum Travel Distance',
        requirement: 'Travel distance ≤ 16.8 m (10 seconds walk)',
        status: 'FAIL',
        matchedEntitiesCount: 2,
        threshold: '≤ 16.8 m'
      },
      {
        id: 'WH-RULE-03',
        code: 'NFPA-101-EGRESS',
        category: 'Life Safety Egress',
        title: 'Maximum Travel Distance to Fire Exit',
        requirement: 'Distance ≤ 60 m to certified egress door',
        status: 'FAIL',
        matchedEntitiesCount: 3,
        threshold: '≤ 60 m'
      },
      {
        id: 'WH-RULE-04',
        code: 'WHO-GDP-ANNEX5',
        category: 'Cold-Chain Integrity',
        title: 'Receiving Dock Thermal Air Curtain Barrier',
        requirement: 'Airlock seal maintaining +2°C to +8°C buffer integrity',
        status: 'PASS',
        matchedEntitiesCount: 5,
        threshold: 'Dual Air Curtain'
      }
    ],
    cadEntities: [
      { id: 'wh-p1', type: 'wall', layer: 'A-WALL', x: 120, y: 100, x2: 1280, y2: 100 },
      { id: 'wh-p2', type: 'wall', layer: 'A-WALL', x: 1280, y: 100, x2: 1280, y2: 780 },
      { id: 'wh-p3', type: 'wall', layer: 'A-WALL', x: 1280, y: 780, x2: 120, y2: 780 },
      { id: 'wh-p4', type: 'wall', layer: 'A-WALL', x: 120, y: 780, x2: 120, y2: 100 },

      // Racks
      { id: 'rk1', type: 'equipment', layer: 'A-RACK', x: 420, y: 200, width: 60, height: 420, label: 'RACK ROW 01' },
      { id: 'rk2', type: 'equipment', layer: 'A-RACK', x: 500, y: 200, width: 60, height: 420, label: 'RACK ROW 02' },
      { id: 'rk3', type: 'equipment', layer: 'A-RACK', x: 640, y: 200, width: 60, height: 420, label: 'RACK ROW 03' },
      { id: 'rk4', type: 'equipment', layer: 'A-RACK', x: 720, y: 200, width: 60, height: 420, label: 'RACK ROW 04' },

      // Rooms
      { id: 'wh-r1', type: 'room', layer: 'A-ROOM', x: 140, y: 520, width: 240, height: 240, label: 'BATTERY CHARGING & CHEMICALS' },
      { id: 'wh-r2', type: 'room', layer: 'A-ROOM', x: 860, y: 120, width: 380, height: 280, label: '-80°C ULTRA-COLD VAULT' },
      { id: 'wh-r3', type: 'room', layer: 'A-ROOM', x: 860, y: 440, width: 380, height: 320, label: 'STAGING & PACKAGING BAY' },
      { id: 'wh-r4', type: 'room', layer: 'A-ROOM', x: 140, y: 120, width: 240, height: 360, label: 'NORTH RECEIVING DOCK' }
    ]
  },
  {
    id: 'radiology-suite',
    name: 'Metro Health Advanced MRI & Diagnostic Pavilion',
    facilityType: 'Radiology & Imaging Suite',
    filename: 'METRO-RAD-SUITE-3T-ARCH.dxf',
    fileType: 'dxf',
    dimensions: {
      width: 1400,
      height: 900,
      scaleLabel: '1:50 Metric',
      unit: 'mm',
      realWidthMm: 56000,
      realHeightMm: 36000,
    },
    specDocument: {
      title: 'ACR Guidance Document on MR Safe Practices & ADA Accessible Design',
      authority: 'American College of Radiology / US Department of Justice (ADA)',
      version: '2023 Update',
      summary: 'Strict magnet fringe field exclusion containment (5-Gauss line), RF shielding enclosure specs, quench emergency exhaust venting, and ADA wheelchair turning envelopes.'
    },
    storyNarrative: {
      summary: 'Specialized diagnostic imaging suite housing a 3.0 Tesla ultra-high-field MRI scanner, PET-CT diagnostic suite, patient prep cubicles, and technologist control gallery.',
      spatialFlow: 'Strict ACR 4-Zone progression: Zone I (Public street access) -> Zone II (Supervised waiting & screening) -> Zone III (Restricted MR console & dressing) -> Zone IV (MR Magnet room).',
      safetyRisk: 'CRITICAL FERROMAGNETIC HAZARD: The fringe magnetic 5-Gauss line spills 650mm beyond the shielded Faraday cage wall into the public Zone II corridor, risking fatal projectile acceleration or pacemaker disruption for unsuspecting visitors.',
      logisticalEfficiency: 'Patient changeroom turnover rate is well-matched with scan time, but ADA accessible restroom fails 1,525mm wheelchair turning clearance by 205mm.',
      keyFindings: [
        '3T Magnet 5-Gauss line projects into unsupervised public waiting corridor.',
        'Restroom 102 fails ADA §304.3.1 turning circle clearance (1,320 mm actual vs 1,525 mm required).',
        'Helium quench pipe route intersects central HVAC return without acoustic separation.'
      ]
    },
    defects: [
      {
        id: 'RAD-DEF-001',
        title: '3-Tesla MRI 5-Gauss Magnetic Boundary Spills Into Public Corridor',
        discipline: 'HealthcareEquipment',
        severity: 'CRITICAL',
        status: 'FLAGGED',
        specCode: 'ACR MR Safety Manual §Zone-IV Perimeter',
        specRequirement: 'The 5-Gauss (0.5 mT) static magnetic fringe field must remain 100% contained within the locked RF-shielded Zone IV scan room perimeter.',
        actualMeasured: '5-Gauss boundary projects 650 mm through wall into Zone II corridor',
        deviation: '+650 mm hazardous electromagnetic spillover',
        remediation: 'Install passive silicon steel plate magnetic shielding (min 12mm thickness) on East partition wall W-RAD-04 to pull 5-Gauss line inside.',
        storyNarrative: 'Any passerby with a cardiac pacemaker or ferromagnetic aneurysm clip walking through the public hallway could experience fatal device malfunction or tissue tear.',
        boundingBox: { x: 580, y: 160, width: 220, height: 180 },
        targetLabel: '3.0T MAGNET 5-GAUSS FRINGE ZONE',
        layer: 'E-MAG',
        confidenceScore: 0.99
      },
      {
        id: 'RAD-DEF-002',
        title: 'Restroom Wheelchair Turning Radius Fails ADA Compliance',
        discipline: 'Accessibility',
        severity: 'MAJOR',
        status: 'FLAGGED',
        specCode: 'ADA Standards §304.3.1 Turning Space',
        specRequirement: 'Accessible patient bathrooms must provide an unobstructed circular turning space with a minimum diameter of 1,525 mm (60").',
        actualMeasured: 'Clear circular space diameter measured at 1,320 mm',
        deviation: '-205 mm (-13.4% restricted wheelchair maneuverability)',
        remediation: 'Replace floor-mounted vanity cabinet with wall-hung ADA lavatory and swing door outward into vestibule.',
        storyNarrative: 'Paraplegic and mobility-impaired patients in wheelchairs cannot perform a safe 360-degree pivot inside the bathroom, risking falls.',
        boundingBox: { x: 210, y: 530, width: 140, height: 130 },
        targetLabel: 'PATIENT ADA RESTROOM 102',
        layer: 'A-RESTROOM',
        confidenceScore: 0.93
      }
    ],
    specs: [
      {
        id: 'RAD-RULE-01',
        code: 'ACR-ZONE-IV',
        category: 'Magnetic Safety',
        title: '5-Gauss Magnetic Fringe Containment',
        requirement: '5-Gauss line completely contained within Zone IV room',
        status: 'FAIL',
        matchedEntitiesCount: 1,
        threshold: '100% Contained'
      },
      {
        id: 'RAD-RULE-02',
        code: 'ADA-304.3.1',
        category: 'Accessibility',
        title: 'Wheelchair 60-inch Turning Circle',
        requirement: 'Diameter ≥ 1,525 mm (60")',
        status: 'FAIL',
        matchedEntitiesCount: 2,
        threshold: '≥ 1,525 mm'
      },
      {
        id: 'RAD-RULE-03',
        code: 'ASME-QUENCH-PIPE',
        category: 'Cryogenic Safety',
        title: 'Helium Emergency Quench Exhaust Ducting',
        requirement: 'Independent dedicated direct-to-roof stainless pipe',
        status: 'PASS',
        matchedEntitiesCount: 1,
        threshold: 'Direct Roof Vent'
      }
    ],
    cadEntities: [
      { id: 'rad-p1', type: 'wall', layer: 'A-WALL', x: 100, y: 100, x2: 1250, y2: 100 },
      { id: 'rad-p2', type: 'wall', layer: 'A-WALL', x: 1250, y: 100, x2: 1250, y2: 750 },
      { id: 'rad-p3', type: 'wall', layer: 'A-WALL', x: 1250, y: 750, x2: 100, y2: 750 },
      { id: 'rad-p4', type: 'wall', layer: 'A-WALL', x: 100, y: 750, x2: 100, y2: 100 },

      { id: 'rad-r1', type: 'room', layer: 'A-ROOM', x: 480, y: 120, width: 340, height: 320, label: '3T MRI SCANNER (ZONE IV)' },
      { id: 'rad-r2', type: 'room', layer: 'A-ROOM', x: 480, y: 460, width: 340, height: 260, label: 'TECH CONSOLE & CONTROL ROOM' },
      { id: 'rad-r3', type: 'room', layer: 'A-ROOM', x: 120, y: 120, width: 340, height: 360, label: 'PUBLIC WAITING (ZONE II)' },
      { id: 'rad-r4', type: 'room', layer: 'A-ROOM', x: 120, y: 500, width: 340, height: 220, label: 'PATIENT ADA RESTROOM 102' },
      { id: 'rad-r5', type: 'room', layer: 'A-ROOM', x: 840, y: 120, width: 390, height: 600, label: 'PET-CT & RADIOPHARM LAB' },

      { id: 'rad-m1', type: 'equipment', layer: 'E-EQUIP', x: 610, y: 220, width: 110, height: 110, label: '3.0T MAGNET BORE' }
    ]
  }
];

export const INITIAL_TRAINING_SAMPLES: TrainingSample[] = [
  {
    id: 'TR-01',
    blueprintName: 'St. Jude Level-4 Surgical Pavilion (STJ-ICU-REV3.dxf)',
    specName: 'FGI 2022 Guidelines & NFPA-101 Life Safety Code',
    annotatedDefectsCount: 5,
    status: 'ground_truth',
    verifiedAccuracy: 0.96
  },
  {
    id: 'TR-02',
    blueprintName: 'Apex BioLogistics Central High-Bay (APEX-WH-02.dxf)',
    specName: 'WHO GDP Annex 5 & OSHA 1910 Industrial Standards',
    annotatedDefectsCount: 3,
    status: 'ground_truth',
    verifiedAccuracy: 0.94
  },
  {
    id: 'TR-03',
    blueprintName: 'Metro Health Advanced MRI & Diagnostic (METRO-RAD-3T.dxf)',
    specName: 'ACR MR Safety Guidance & ADA Section 304 Standards',
    annotatedDefectsCount: 2,
    status: 'ground_truth',
    verifiedAccuracy: 0.98
  },
  {
    id: 'TR-04',
    blueprintName: 'Memorial Sloan Cancer Outpatient Infusion Wing',
    specName: 'USP 800 Hazardous Drug Handling & AIA Cleanroom Codes',
    annotatedDefectsCount: 4,
    status: 'augmented',
    verifiedAccuracy: 0.91
  },
  {
    id: 'TR-05',
    blueprintName: 'Geneva BioHub Sterile Fill-Finish Production Facility',
    specName: 'EU GMP Annex 1 Cleanroom Classification & Air Barrier',
    annotatedDefectsCount: 6,
    status: 'synthetic',
    verifiedAccuracy: 0.89
  }
];
