-- Solar Systems - Seed Data
-- Run this after schema.sql to populate with sample data

-- ============================================
-- SAMPLE PROJECTS
-- ============================================
INSERT INTO projects (id, title, description, capacity_kw, address, city, state, latitude, longitude, images, installation_date, status, tags) VALUES
(
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Mumbai Commercial Complex',
    'A 500kW rooftop solar installation for a major commercial complex in Mumbai. This project features high-efficiency monocrystalline panels with smart monitoring systems. The installation reduces carbon emissions by approximately 600 tonnes annually.',
    500.00,
    '123 Business Park, Andheri East',
    'Mumbai',
    'Maharashtra',
    19.0760,
    72.8777,
    ARRAY['https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800', 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=800'],
    '2023-06-15',
    'active',
    ARRAY['commercial', 'rooftop', 'large-scale']
),
(
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'Bangalore Tech Park',
    'State-of-the-art 750kW solar installation powering a major IT park in Bangalore. Features bifacial panels and AI-powered energy optimization. Powers over 5,000 workstations with clean energy.',
    750.00,
    'Electronic City Phase 1',
    'Bangalore',
    'Karnataka',
    12.9716,
    77.5946,
    ARRAY['https://images.unsplash.com/photo-1545208942-e0c45d2d07c7?w=800', 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800'],
    '2023-09-20',
    'active',
    ARRAY['commercial', 'tech-park', 'bifacial']
),
(
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    'Chennai Manufacturing Plant',
    'Industrial-scale 1MW solar installation for a leading manufacturing facility. Includes ground-mounted tracking systems that follow the sun for maximum efficiency. Reduces energy costs by 70%.',
    1000.00,
    'SIPCOT Industrial Park, Sriperumbudur',
    'Chennai',
    'Tamil Nadu',
    13.0827,
    80.2707,
    ARRAY['https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800', 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=800'],
    '2023-11-10',
    'active',
    ARRAY['industrial', 'ground-mount', 'tracking']
),
(
    'd4e5f6a7-b8c9-0123-def1-234567890123',
    'Hyderabad Residential Community',
    'Community solar project serving 200+ homes in a gated residential complex. 250kW shared solar installation with individual metering for each household.',
    250.00,
    'Gachibowli, Financial District',
    'Hyderabad',
    'Telangana',
    17.4065,
    78.4772,
    ARRAY['https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=800'],
    '2024-01-15',
    'active',
    ARRAY['residential', 'community', 'shared']
),
(
    'e5f6a7b8-c9d0-1234-ef12-345678901234',
    'Pune Educational Campus',
    '350kW solar installation across multiple buildings of a prestigious educational institution. Includes solar-powered EV charging stations and serves as a live learning laboratory for students.',
    350.00,
    'Savitribai Phule Pune University Campus',
    'Pune',
    'Maharashtra',
    18.5204,
    73.8567,
    ARRAY['https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=800', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800'],
    '2024-02-28',
    'active',
    ARRAY['educational', 'campus', 'ev-charging']
),
(
    'f6a7b8c9-d0e1-2345-f123-456789012345',
    'Ahmedabad Hospital Complex',
    'Critical 400kW solar backup system for a multi-specialty hospital. Includes battery storage for 24/7 power reliability. Meets 80% of the hospital''s energy needs.',
    400.00,
    'SG Highway, Bodakdev',
    'Ahmedabad',
    'Gujarat',
    23.0225,
    72.5714,
    ARRAY['https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=800'],
    '2024-04-05',
    'active',
    ARRAY['healthcare', 'backup-power', 'battery-storage']
),
(
    'a7b8c9d0-e1f2-3456-a123-567890123456',
    'Jaipur Heritage Hotel',
    'Elegant 150kW solar installation designed to blend with heritage architecture. Powers a luxury hotel while preserving its historic aesthetic. Features building-integrated photovoltaics.',
    150.00,
    'MI Road, Civil Lines',
    'Jaipur',
    'Rajasthan',
    26.9124,
    75.7873,
    ARRAY['https://images.unsplash.com/photo-1545208942-e0c45d2d07c7?w=800', 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800'],
    '2024-05-20',
    'active',
    ARRAY['hospitality', 'heritage', 'bipv']
),
(
    'b8c9d0e1-f2a3-4567-b234-678901234567',
    'Kochi Port Authority',
    '600kW solar installation at the port administrative complex. Maritime-grade panels resistant to saline corrosion. Powers port operations and lighting systems.',
    600.00,
    'Willingdon Island',
    'Kochi',
    'Kerala',
    9.9312,
    76.2673,
    ARRAY['https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800'],
    '2024-06-30',
    'completed',
    ARRAY['maritime', 'industrial', 'corrosion-resistant']
),
(
    'c9d0e1f2-a3b4-5678-c345-789012345678',
    'Delhi Metro Depot',
    '2MW solar installation at metro train maintenance depot. One of the largest rooftop installations in Delhi NCR. Powers train maintenance and depot operations.',
    2000.00,
    'Khyber Pass, Civil Lines',
    'Delhi',
    'Delhi',
    28.7041,
    77.1025,
    ARRAY['https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800', 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=800'],
    '2024-08-15',
    'active',
    ARRAY['transportation', 'large-scale', 'rooftop']
),
(
    'd0e1f2a3-b4c5-6789-d456-890123456789',
    'Kolkata Shopping Mall',
    '450kW solar installation on mall rooftop. Reduces cooling costs significantly while powering common areas and lighting. Features aesthetically integrated panel design.',
    450.00,
    'South City Mall, Prince Anwar Shah Road',
    'Kolkata',
    'West Bengal',
    22.5726,
    88.3639,
    ARRAY['https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=800'],
    '2024-09-10',
    'active',
    ARRAY['retail', 'rooftop', 'aesthetic']
);

-- ============================================
-- SAMPLE REVIEWS
-- ============================================
INSERT INTO reviews (project_id, reviewer_name, rating, comment, is_approved, admin_response, created_at) VALUES
(
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Rajesh Sharma',
    5,
    'Excellent work by the Solar Systems team! Our commercial complex has seen a 60% reduction in electricity bills. The installation was professional and completed on time. Highly recommended!',
    TRUE,
    'Thank you Rajesh! We''re thrilled to hear about your savings.',
    '2023-08-15'
),
(
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'Priya Venkatesh',
    5,
    'Our tech park is now running on clean energy thanks to Solar Systems. The AI optimization feature is fantastic - we can monitor everything in real-time. Great investment!',
    TRUE,
    'Thanks Priya! The monitoring dashboard is one of our favorite features too.',
    '2023-11-05'
),
(
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    'Arun Kumar',
    4,
    'Very satisfied with the industrial installation. The tracking system really makes a difference in energy generation. Only minor delay in initial setup, but overall great service.',
    TRUE,
    'Thank you Arun for your feedback. We appreciate your patience during setup.',
    '2024-01-20'
),
(
    'd4e5f6a7-b8c9-0123-def1-234567890123',
    'Sunita Reddy',
    5,
    'Our residential community loves the shared solar system! Each home gets fair billing and we''re all saving money. The team explained everything clearly to all residents.',
    TRUE,
    'Thank you Sunita! Community projects are close to our heart.',
    '2024-03-10'
),
(
    'e5f6a7b8-c9d0-1234-ef12-345678901234',
    'Dr. Mohan Patil',
    5,
    'As an educational institution, having solar panels that students can learn from is invaluable. The EV charging stations are an added bonus. Outstanding work!',
    TRUE,
    'Thank you Dr. Patil! We love working with educational institutions.',
    '2024-04-15'
),
(
    'f6a7b8c9-d0e1-2345-f123-456789012345',
    'Anita Desai',
    5,
    'For a hospital, reliable power is critical. Solar Systems delivered a robust system with battery backup. We haven''t had a single power-related issue since installation.',
    TRUE,
    'Thank you Anita! Healthcare facilities deserve the best reliability.',
    '2024-05-25'
),
(
    'a7b8c9d0-e1f2-3456-a123-567890123456',
    'Vikram Singh',
    4,
    'The heritage hotel installation looks beautiful - the panels blend perfectly with our architecture. Guests appreciate our sustainability efforts.',
    TRUE,
    'Thank you Vikram! Heritage projects require special care.',
    '2024-06-20'
),
(
    'b8c9d0e1-f2a3-4567-b234-678901234567',
    'Captain Ramesh',
    5,
    'Maritime environment is tough on equipment, but these panels are holding up excellently. The saline-resistant coating really works. Port operations are now greener!',
    TRUE,
    'Thank you Captain! Maritime installations are our specialty.',
    '2024-07-30'
),
(
    'c9d0e1f2-a3b4-5678-c345-789012345678',
    'Meera Gupta',
    5,
    'The Delhi Metro depot installation is massive and impressive. Solar Systems handled the scale professionally. Maintenance is minimal and performance is excellent.',
    TRUE,
    'Thank you Meera! Large-scale projects are what we excel at.',
    '2024-09-20'
),
(
    'd0e1f2a3-b4c5-6789-d456-890123456789',
    'Sanjay Banerjee',
    4,
    'Our mall''s rooftop solar looks great and performs even better. Shoppers appreciate that we''re using clean energy. Would recommend for any retail space.',
    TRUE,
    'Thank you Sanjay! Retail spaces benefit greatly from solar.',
    '2024-10-15'
),
-- Pending reviews (not approved yet)
(
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Karan Malhotra',
    5,
    'Just got my first electricity bill after solar installation - it''s 65% lower! Amazing results.',
    FALSE,
    NULL,
    '2024-11-01'
),
(
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'Lakshmi Iyer',
    4,
    'Good service and professional team. The monitoring app is very user-friendly.',
    FALSE,
    NULL,
    '2024-11-05'
);

-- ============================================
-- SAMPLE INQUIRIES
-- ============================================
INSERT INTO inquiries (project_id, name, email, phone, message, status, notes, created_at) VALUES
(
    NULL,
    'Amit Patel',
    'amit.patel@email.com',
    '+91 98765 12345',
    'I''m interested in installing solar panels for my factory in Surat. We have about 50,000 sq ft of rooftop space. Can you provide a quote?',
    'new',
    NULL,
    '2024-11-01'
),
(
    NULL,
    'Deepa Krishnan',
    'deepa.k@email.com',
    '+91 87654 98765',
    'Looking for solar solutions for our apartment complex in Bangalore. We have 120 flats. Please contact me to discuss options.',
    'in_progress',
    'Called on 2024-11-03, scheduled site visit for 2024-11-10',
    '2024-11-02'
),
(
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Rohan Gupta',
    'rohan.gupta@company.com',
    '+91 76543 87654',
    'Saw your Mumbai Commercial Complex project. We have a similar building nearby and would like the same setup. Please send details.',
    'new',
    NULL,
    '2024-11-05'
),
(
    NULL,
    'Fatima Khan',
    'fatima.khan@email.com',
    '+91 65432 76543',
    'Interested in solar for my home in Hyderabad. Monthly bill is around Rs. 8000. What size system would you recommend?',
    'resolved',
    'Sent recommendation for 5kW system on 2024-11-04',
    '2024-10-28'
),
(
    NULL,
    'Suresh Menon',
    'suresh.menon@business.com',
    '+91 54321 65432',
    'We run a chain of hotels and are looking to go solar across all properties. Can we schedule a meeting to discuss a corporate partnership?',
    'in_progress',
    'Enterprise deal - escalated to sales director',
    '2024-10-25'
);

-- ============================================
-- UPDATE SETTINGS
-- ============================================
UPDATE settings SET
    org_name = 'Solar Systems India',
    contact_email = 'info@solarsystems.in',
    contact_phone = '+91 1800 123 4567',
    org_address = 'Solar Tower, 101 Green Energy Road, Mumbai, Maharashtra 400001',
    kwh_per_kw_per_month = 130.00,
    tariff_per_kwh = 8.50,
    system_cost_per_kw = 45000.00,
    subsidy_percentage = 30.00,
    maintenance_cost_per_kw_year = 500.00,
    carousel_speed = 30,
    map_center_lat = 21.000000,
    map_center_lng = 78.000000,
    map_zoom = 5
WHERE id = 1;
