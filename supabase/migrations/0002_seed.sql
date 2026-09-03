-- Afghanistan seed users, tasks, offers, chats, and reviews.
-- Demo login: ahmad@neartask.local / NearTask!2026

do $$
declare
  pwd text := extensions.crypt('NearTask!2026', extensions.gen_salt('bf'));
  u1 uuid := 'c0a1f001-0000-4000-8000-000000000001';
  u2 uuid := 'c0a1f001-0000-4000-8000-000000000002';
  u3 uuid := 'c0a1f001-0000-4000-8000-000000000003';
  u4 uuid := 'c0a1f001-0000-4000-8000-000000000004';
  u5 uuid := 'c0a1f001-0000-4000-8000-000000000005';
  u6 uuid := 'c0a1f001-0000-4000-8000-000000000006';
  u7 uuid := 'c0a1f001-0000-4000-8000-000000000007';
  u8 uuid := 'c0a1f001-0000-4000-8000-000000000008';
  u9 uuid := 'c0a1f001-0000-4000-8000-000000000009';
  u10 uuid := 'c0a1f001-0000-4000-8000-00000000000a';
  u11 uuid := 'c0a1f001-0000-4000-8000-00000000000b';
  u12 uuid := 'c0a1f001-0000-4000-8000-00000000000c';
  t1 uuid := 'c0a1f00d-0000-4000-8000-000000000001';
  t2 uuid := 'c0a1f00d-0000-4000-8000-000000000002';
  t3 uuid := 'c0a1f00d-0000-4000-8000-000000000003';
  t4 uuid := 'c0a1f00d-0000-4000-8000-000000000004';
  t5 uuid := 'c0a1f00d-0000-4000-8000-000000000005';
  t6 uuid := 'c0a1f00d-0000-4000-8000-000000000006';
  t7 uuid := 'c0a1f00d-0000-4000-8000-000000000007';
  t8 uuid := 'c0a1f00d-0000-4000-8000-000000000008';
  t9 uuid := 'c0a1f00d-0000-4000-8000-000000000009';
  t10 uuid := 'c0a1f00d-0000-4000-8000-00000000000a';
  t11 uuid := 'c0a1f00d-0000-4000-8000-00000000000b';
  t12 uuid := 'c0a1f00d-0000-4000-8000-00000000000c';
  t13 uuid := 'c0a1f00d-0000-4000-8000-00000000000d';
  t14 uuid := 'c0a1f00d-0000-4000-8000-00000000000e';
  t15 uuid := 'c0a1f00d-0000-4000-8000-00000000000f';
  t16 uuid := 'c0a1f00d-0000-4000-8000-000000000010';
  t17 uuid := 'c0a1f00d-0000-4000-8000-000000000011';
  t18 uuid := 'c0a1f00d-0000-4000-8000-000000000012';
  t19 uuid := 'c0a1f00d-0000-4000-8000-000000000013';
  t20 uuid := 'c0a1f00d-0000-4000-8000-000000000014';
  t21 uuid := 'c0a1f00d-0000-4000-8000-000000000015';
  t22 uuid := 'c0a1f00d-0000-4000-8000-000000000016';
  o1 uuid := 'c0a1f00e-0000-4000-8000-000000000001';
  conv1 uuid := 'c0a1f00f-0000-4000-8000-000000000001';
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token,
    is_sso_user, is_anonymous
  )
  values
    ('00000000-0000-0000-0000-000000000000', u1, 'authenticated', 'authenticated', 'ahmad@neartask.local', pwd, now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Ahmad Karimi"}', now(), now(), '', '', '', '', false, false),
    ('00000000-0000-0000-0000-000000000000', u2, 'authenticated', 'authenticated', 'fatima@neartask.local', pwd, now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Fatima Rahimi"}', now(), now(), '', '', '', '', false, false),
    ('00000000-0000-0000-0000-000000000000', u3, 'authenticated', 'authenticated', 'omar@neartask.local', pwd, now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Omar Nasiri"}', now(), now(), '', '', '', '', false, false),
    ('00000000-0000-0000-0000-000000000000', u4, 'authenticated', 'authenticated', 'laila@neartask.local', pwd, now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Laila Ahmadi"}', now(), now(), '', '', '', '', false, false),
    ('00000000-0000-0000-0000-000000000000', u5, 'authenticated', 'authenticated', 'reza@neartask.local', pwd, now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Reza Popalzai"}', now(), now(), '', '', '', '', false, false),
    ('00000000-0000-0000-0000-000000000000', u6, 'authenticated', 'authenticated', 'mariam@neartask.local', pwd, now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Mariam Sultani"}', now(), now(), '', '', '', '', false, false),
    ('00000000-0000-0000-0000-000000000000', u7, 'authenticated', 'authenticated', 'farid@neartask.local', pwd, now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Farid Hakimi"}', now(), now(), '', '', '', '', false, false),
    ('00000000-0000-0000-0000-000000000000', u8, 'authenticated', 'authenticated', 'zahra@neartask.local', pwd, now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Zahra Noori"}', now(), now(), '', '', '', '', false, false),
    ('00000000-0000-0000-0000-000000000000', u9, 'authenticated', 'authenticated', 'hassan@neartask.local', pwd, now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Hassan Barakzai"}', now(), now(), '', '', '', '', false, false),
    ('00000000-0000-0000-0000-000000000000', u10, 'authenticated', 'authenticated', 'nadia@neartask.local', pwd, now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Nadia Sharifi"}', now(), now(), '', '', '', '', false, false),
    ('00000000-0000-0000-0000-000000000000', u11, 'authenticated', 'authenticated', 'bilal@neartask.local', pwd, now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Bilal Momand"}', now(), now(), '', '', '', '', false, false),
    ('00000000-0000-0000-0000-000000000000', u12, 'authenticated', 'authenticated', 'sara@neartask.local', pwd, now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Sara Qaderi"}', now(), now(), null, '', null, null, false, false);

  insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  values
    (gen_random_uuid(), u1, jsonb_build_object('sub', u1::text, 'email', 'ahmad@neartask.local'), 'email', u1::text, now(), now(), now()),
    (gen_random_uuid(), u2, jsonb_build_object('sub', u2::text, 'email', 'fatima@neartask.local'), 'email', u2::text, now(), now(), now()),
    (gen_random_uuid(), u3, jsonb_build_object('sub', u3::text, 'email', 'omar@neartask.local'), 'email', u3::text, now(), now(), now()),
    (gen_random_uuid(), u4, jsonb_build_object('sub', u4::text, 'email', 'laila@neartask.local'), 'email', u4::text, now(), now(), now()),
    (gen_random_uuid(), u5, jsonb_build_object('sub', u5::text, 'email', 'reza@neartask.local'), 'email', u5::text, now(), now(), now()),
    (gen_random_uuid(), u6, jsonb_build_object('sub', u6::text, 'email', 'mariam@neartask.local'), 'email', u6::text, now(), now(), now()),
    (gen_random_uuid(), u7, jsonb_build_object('sub', u7::text, 'email', 'farid@neartask.local'), 'email', u7::text, now(), now(), now()),
    (gen_random_uuid(), u8, jsonb_build_object('sub', u8::text, 'email', 'zahra@neartask.local'), 'email', u8::text, now(), now(), now()),
    (gen_random_uuid(), u9, jsonb_build_object('sub', u9::text, 'email', 'hassan@neartask.local'), 'email', u9::text, now(), now(), now()),
    (gen_random_uuid(), u10, jsonb_build_object('sub', u10::text, 'email', 'nadia@neartask.local'), 'email', u10::text, now(), now(), now()),
    (gen_random_uuid(), u11, jsonb_build_object('sub', u11::text, 'email', 'bilal@neartask.local'), 'email', u11::text, now(), now(), now()),
    (gen_random_uuid(), u12, jsonb_build_object('sub', u12::text, 'email', 'sara@neartask.local'), 'email', u12::text, now(), now(), now());

  update public.profiles set
    area = v.area, locality = v.locality, city = v.city, lat = v.lat, lng = v.lng,
    bio = v.bio, intent = v.intent, onboarding_completed_at = now(),
    average_rating = v.rating, review_count = v.reviews
  from (values
    (u1, 'Flower Street', 'Shar-e-Naw', 'Kabul', 34.5320, 69.1715, 'Need a hand around Shar-e-Naw.', 'need_help', 4.8, 6),
    (u2, 'Taimani', 'Taimani', 'Kabul', 34.5450, 69.1600, 'Happy to help with errands and tutoring.', 'want_to_earn', 4.9, 11),
    (u3, 'Karte Char', 'Karte Char', 'Kabul', 34.5089, 69.1506, 'Plumber and small repairs.', 'want_to_earn', 4.6, 8),
    (u4, 'Wazir Akbar Khan', 'Wazir Akbar Khan', 'Kabul', 34.5408, 69.1835, 'Looking for help at home.', 'need_help', 5.0, 3),
    (u5, 'Khair Khana', 'Khair Khana', 'Kabul', 34.5550, 69.1667, 'Tech fixes and phone screens.', 'want_to_earn', 4.7, 9),
    (u6, 'Microrayon', 'Microrayon', 'Kabul', 34.5380, 69.2100, 'Study help and language practice.', 'want_to_earn', 4.9, 4),
    (u7, 'Herat Old City', 'District 1', 'Herat', 34.3480, 62.1990, 'Local helper in Herat.', 'want_to_earn', 4.5, 5),
    (u8, 'Jada-e Maiwand', 'District 2', 'Kandahar', 31.6200, 65.7200, 'Errands around Kandahar.', 'need_help', 4.4, 2),
    (u9, 'Balkh Road', 'District 3', 'Mazar-i-Sharif', 36.7080, 67.1180, 'Moving and heavy lifting.', 'want_to_earn', 4.8, 7),
    (u10, 'Jalalabad City', 'District 1', 'Jalalabad', 34.4300, 70.4510, 'Food and catering help.', 'need_help', 4.6, 3),
    (u11, 'Karte Se', 'Karte Se', 'Kabul', 34.4980, 69.1450, 'Student who can run errands.', 'want_to_earn', 4.3, 2),
    (u12, 'Kolola Pushta', 'Kolola Pushta', 'Kabul', 34.5412, 69.1520, 'Fashion and tailoring.', 'need_help', 4.7, 4)
  ) as v(id, area, locality, city, lat, lng, bio, intent, rating, reviews)
  where profiles.id = v.id;

  insert into public.tasks (
    id, requester_id, helper_id, title, description, category, budget_amount,
    visibility_radius_km, area, locality, city, lat, lng, scheduled_at, status, completed_at
  ) values
    (t1, u1, null, 'Fix leaking kitchen tap', 'The kitchen tap drips all night. Need someone who can replace the washer today.', 'services', 800, 5, 'Flower Street', 'Shar-e-Naw', 'Kabul', 34.5320, 69.1715, now() + interval '3 hours', 'offer_received', null),
    (t2, u4, null, 'Math tutoring for Grade 10', 'Looking for a tutor this week for algebra and geometry. Two-hour session.', 'study', 1200, 5, 'Wazir Akbar Khan', 'Wazir Akbar Khan', 'Kabul', 34.5408, 69.1835, now() + interval '1 day', 'open', null),
    (t3, u1, null, 'Grocery run from Finest', 'Need rice, oil, and vegetables picked up and dropped at home this afternoon.', 'errands', 400, 2, 'Flower Street', 'Shar-e-Naw', 'Kabul', 34.5335, 69.1728, now() + interval '5 hours', 'open', null),
    (t4, u12, null, 'Hem a party dress', 'Black dress needs a 4cm hem before Friday. Bring your machine if you can.', 'fashion', 600, 5, 'Kolola Pushta', 'Kolola Pushta', 'Kabul', 34.5412, 69.1520, now() + interval '2 days', 'open', null),
    (t5, u4, null, 'Laptop running very slow', 'Windows laptop is slow after an update. Need a cleanup and check for malware.', 'tech', 1500, 10, 'Wazir Akbar Khan', 'Wazir Akbar Khan', 'Kabul', 34.5415, 69.1840, now() + interval '6 hours', 'open', null),
    (t6, u8, null, 'Cook qabuli for 8 guests', 'Family dinner on Thursday. Ingredients will be provided.', 'food', 2500, 10, 'Jada-e Maiwand', 'District 2', 'Kandahar', 31.6200, 65.7200, now() + interval '3 days', 'open', null),
    (t7, u10, null, 'Need a wedding hall chairs rental', 'Looking to borrow or rent 40 chairs for a small gathering.', 'rentals', 3500, 10, 'Jalalabad City', 'District 1', 'Jalalabad', 34.4300, 70.4510, now() + interval '4 days', 'open', null),
    (t8, u1, u3, 'Move a sofa up two floors', 'Two-seater sofa from a van into a second-floor apartment. Stairs only.', 'services', 1000, 5, 'Flower Street', 'Shar-e-Naw', 'Kabul', 34.5310, 69.1700, now() + interval '8 hours', 'helper_selected', null),
    (t9, u4, u5, 'Replace phone screen', 'Samsung A54 cracked screen. Parts can be bought nearby, paid in cash.', 'tech', 2200, 5, 'Wazir Akbar Khan', 'Wazir Akbar Khan', 'Kabul', 34.5400, 69.1820, now() - interval '1 day', 'in_progress', null),
    (t10, u12, u2, 'Deliver documents to ministry', 'Envelope pickup from Kolola Pushta and drop at the ministry gate.', 'errands', 350, 10, 'Kolola Pushta', 'Kolola Pushta', 'Kabul', 34.5410, 69.1510, now() - interval '3 days', 'completed', now() - interval '2 days'),
    (t11, u6, null, 'English conversation practice', 'One-hour spoken English practice for a university interview.', 'study', 500, 5, 'Microrayon', 'Microrayon', 'Kabul', 34.5380, 69.2100, now() + interval '2 days', 'open', null),
    (t12, u11, null, 'Assemble IKEA-style desk', 'New desk in the box. Need someone with a screwdriver this evening.', 'services', 700, 5, 'Karte Se', 'Karte Se', 'Kabul', 34.4980, 69.1450, now() + interval '7 hours', 'open', null),
    (t13, u7, null, 'Help painting a bedroom', 'One room, light blue. Paint is ready. About 4 hours of work.', 'services', 1800, 10, 'Herat Old City', 'District 1', 'Herat', 34.3480, 62.1990, now() + interval '2 days', 'open', null),
    (t14, u9, null, 'Load a pickup with furniture', 'Help loading chairs and a table onto a pickup near the shrine.', 'services', 900, 5, 'Balkh Road', 'District 3', 'Mazar-i-Sharif', 36.7080, 67.1180, now() + interval '1 day', 'open', null),
    (t15, u1, null, 'Borrow a projector for a night', 'Need a small projector for a family film night. Cash deposit ok.', 'rentals', 800, 5, 'Flower Street', 'Shar-e-Naw', 'Kabul', 34.5328, 69.1710, now() + interval '2 days', 'open', null),
    (t16, u4, null, 'Home-cooked lunch for two', 'Simple lunch \u2014 rice, beans, salad. Delivery to Wazir Akbar Khan.', 'food', 650, 5, 'Wazir Akbar Khan', 'Wazir Akbar Khan', 'Kabul', 34.5405, 69.1830, now() + interval '10 hours', 'open', null),
    (t17, u12, null, 'Alter two pairs of trousers', 'Waist taken in by 3cm. Can drop off this afternoon.', 'fashion', 450, 5, 'Kolola Pushta', 'Kolola Pushta', 'Kabul', 34.5420, 69.1530, now() + interval '1 day', 'open', null),
    (t18, u11, null, 'Help with computer homework', 'Grade 12 student needs help formatting a Word assignment.', 'study', 300, 2, 'Karte Se', 'Karte Se', 'Kabul', 34.4990, 69.1460, now() + interval '4 hours', 'open', null),
    (t19, u1, null, 'Pick up a parcel from post', 'Small parcel at the main post office. I will share the slip in chat.', 'errands', 250, 5, 'Flower Street', 'Shar-e-Naw', 'Kabul', 34.5340, 69.1735, now() + interval '6 hours', 'open', null),
    (t20, u5, null, 'Install a Wi-Fi router', 'New router, apartment on third floor. Cable is already in the wall.', 'tech', 900, 5, 'Khair Khana', 'Khair Khana', 'Kabul', 34.5550, 69.1667, now() + interval '9 hours', 'open', null),
    (t21, u4, u6, 'Proofread a university essay', '800-word essay in English. Need comments by tonight.', 'study', 700, 10, 'Wazir Akbar Khan', 'Wazir Akbar Khan', 'Kabul', 34.5410, 69.1838, now() - interval '5 days', 'completed', now() - interval '4 days'),
    (t22, u8, null, 'Other: find a missing goat', 'Goat wandered from the yard this morning. Last seen near the market.', 'other', 1500, 10, 'Jada-e Maiwand', 'District 2', 'Kandahar', 31.6210, 65.7210, now() + interval '2 hours', 'open', null);

  insert into public.task_addresses (task_id, formatted_address)
  select id, area || ', ' || locality || ', ' || city || ', Afghanistan' from public.tasks;

  insert into public.offers (id, task_id, helper_id, message, status) values
    (o1, t1, u3, 'I can come this afternoon with spare washers. Cash is fine.', 'pending'),
    (gen_random_uuid(), t1, u5, 'Happy to take a look after 5pm.', 'pending'),
    (gen_random_uuid(), t2, u6, 'I tutor Grade 10 math twice a week. Available tomorrow.', 'pending'),
    (gen_random_uuid(), t8, u3, 'I have a friend and we can lift the sofa safely.', 'accepted'),
    (gen_random_uuid(), t9, u5, 'I replace screens often. I can buy the part nearby.', 'accepted'),
    (gen_random_uuid(), t10, u2, 'I pass the ministry on my way. Easy drop-off.', 'accepted'),
    (gen_random_uuid(), t21, u6, 'I can proofread this evening and send notes.', 'accepted');

  insert into public.conversations (id, task_id, requester_id, helper_id, last_message_at, last_message_preview) values
    (conv1, t8, u1, u3, now() - interval '40 minutes', 'I am downstairs with a friend.'),
    (gen_random_uuid(), t9, u4, u5, now() - interval '2 hours', 'On my way with the screen.'),
    (gen_random_uuid(), t10, u12, u2, now() - interval '2 days', 'Delivered. Thank you!'),
    (gen_random_uuid(), t21, u4, u6, now() - interval '4 days', 'Essay looks good now.');

  insert into public.messages (conversation_id, sender_id, body, created_at, read_at)
  select conv1, u1, 'The sofa is in the van outside. Stairs are on the left.', now() - interval '1 hour', now() - interval '50 minutes'
  union all select conv1, u3, 'I am downstairs with a friend.', now() - interval '40 minutes', null;

  insert into public.reviews (task_id, reviewer_id, reviewee_id, rating, comment)
  values
    (t10, u12, u2, 5, 'Quick and careful. Paid in cash at the door.'),
    (t10, u2, u12, 5, 'Clear instructions and easy to find.'),
    (t21, u4, u6, 5, 'Helpful notes on the essay.'),
    (t21, u6, u4, 4, 'Paid cash as agreed. Thank you.');
end;
$$;
