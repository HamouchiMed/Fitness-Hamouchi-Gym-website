/**
 * English content.
 *
 * Lower search volume than French in Berrechid, but it serves expats, visiting
 * athletes and anyone searching in English, and it costs nothing to maintain
 * once written. It is also the locale most likely to earn links from outside
 * Morocco, which is the single hardest thing to get for a local business site.
 */

export default {
  // English slugs for the English locale — "pricing" and "classes" are what an
  // English speaker types and expects to see in the URL.
  routes: {
    home: '',
    clubs: 'clubs',
    disciplines: 'classes',
    pricing: 'pricing',
    coach: 'coach',
    gallery: 'gallery',
    contact: 'contact',
    blog: 'blog',
  },

  ui: {
    skipToContent: 'Skip to main content',
    menu: 'Menu',
    close: 'Close',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'Language',
    changeLanguage: 'Change language',
    callNow: 'Call us',
    whatsapp: 'WhatsApp',
    joinNow: 'Join now',
    freeTrial: 'Free trial session',
    learnMore: 'Learn more',
    seeAll: 'See all',
    seeClub: 'View club',
    seePricing: 'See pricing',
    getDirections: 'Directions',
    openingHours: 'Opening hours',
    address: 'Address',
    phone: 'Phone',
    email: 'Email',
    closed: 'Closed',
    today: 'Today',
    openNow: 'Open now',
    closedNow: 'Currently closed',
    from: 'From',
    perSession: '/ session',
    perMonth: '/ month',
    perQuarter: '/ 3 months',
    perYear: '/ year',
    onRequest: 'On request',
    mostPopular: 'Most popular',
    scrollToExplore: 'Scroll to explore',
    backToTop: 'Back to top',
    readArticle: 'Read the article',
    published: 'Published',
    updated: 'Updated',
    readingTime: 'min read',
    byAuthor: 'By',
    breadcrumbHome: 'Home',
    relatedArticles: 'Read next',
    allRightsReserved: 'All rights reserved',
    legalNotice: 'Legal notice',
    sitemapLabel: 'Sitemap',
    followUs: 'Follow us',
    quickLinks: 'Navigation',
    ourClubs: 'Our clubs',
    newsletterTitle: 'Training tips, once a month',
    newsletterNote: 'No spam. Unsubscribe in one click.',
    emailPlaceholder: 'your@email.com',
    subscribe: 'Subscribe',
    days: {
      Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday',
      Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday',
    },
    daysShort: { Mo: 'Mon', Tu: 'Tue', We: 'Wed', Th: 'Thu', Fr: 'Fri', Sa: 'Sat', Su: 'Sun' },
  },

  nav: {
    home: 'Home',
    clubs: 'Our clubs',
    disciplines: 'Classes',
    pricing: 'Pricing',
    coach: 'The coach',
    gallery: 'Gallery',
    blog: 'Tips',
    contact: 'Contact',
  },

  home: {
    seo: {
      title: 'Gym in Berrechid, Morocco — Fitness Hamouchi Gym',
      description:
        'Two fully equipped gyms in Berrechid: weight training, cross training, cardio, boxing and women’s fitness. Qualified coaches, open 7 days a week. First session free.',
      targets: [
        'gym berrechid',
        'gym in berrechid morocco',
        'fitness berrechid',
        'weight training berrechid',
        'personal trainer berrechid',
        'women only gym berrechid',
      ],
    },
    hero: {
      kicker: 'Berrechid · Two clubs · Open 7 days',
      titleLines: ['Become', 'the strongest', 'version', 'of yourself'],
      lead:
        'Weight training, cross training, cardio and boxing across two fully equipped gyms in Berrechid. Coaches who fix your technique, a programme built around you, and a room you actually want to come back to.',
      primaryCta: 'Book my free session',
      secondaryCta: 'See the clubs',
      scrollHint: 'Scroll to explore',
    },
    stats: {
      title: 'By the numbers',
      members: 'active members',
      years: 'years in business',
      coaches: 'qualified coaches',
      surface: 'm² of floor space',
    },
    intro: {
      kicker: 'Who we are',
      title: 'A neighbourhood gym held to competition standards',
      body: [
        'Fitness Hamouchi Gym started in Berrechid from a simple idea: you should not have to drive to Casablanca to train seriously. Two clubs, equipment we replace when it wears out, and coaches who stand on the training floor — not behind the front desk.',
        'Whether you have been lifting for ten years or have never set foot in a gym, we start where you are. We show you the movements, watch your positions, and adjust as you go.',
      ],
      bullets: [
        'Free assessment and personal programme when you join',
        'A coach on the floor during every opening hour',
        'No hidden joining fees, no forced commitment',
        'Dedicated women’s area and time slots',
      ],
      cta: 'Meet the team',
    },
    disciplines: {
      kicker: 'Disciplines',
      title: 'Pick your ground',
      lead: 'Five coached disciplines, all included in your membership. Switch whenever you like, combine them however you like.',
    },
    clubs: {
      kicker: 'Our locations',
      title: 'Two clubs in Berrechid',
      lead:
        'Each club has its own character and equipment. Your membership covers the one you choose — ask us about access to both.',
    },
    coach: {
      kicker: 'Coaching',
      title: 'You never train alone',
      body: [
        'Khalid Hamouchi has been coaching in Berrechid for over ten years. He built both clubs around one conviction: a good coach does not count your reps, he fixes the movement before the injury arrives.',
        'The team follows the same rule. If your form breaks down on a deadlift, someone will come and tell you — politely, but they will come.',
      ],
      cta: 'More about the team',
    },
    gallery: {
      kicker: 'In pictures',
      title: 'Inside the clubs',
      lead: 'The floor, the kit, the atmosphere. Seeing it in person is still better.',
    },
    pricing: {
      kicker: 'Pricing',
      title: 'Clear prices, published openly',
      lead:
        'Everything is included: open access, group classes, changing rooms and hot showers. No admin fee, and no surprise in month two.',
    },
    faq: { kicker: 'Your questions', title: 'What people ask us most' },
    cta: {
      kicker: 'When do we start?',
      title: 'Your first session is free',
      lead:
        'Come and train once, free, without signing anything. Look around, try the equipment, talk to a coach. If you like it, we can talk about the rest.',
      primary: 'Book my free session',
      secondary: 'Call us',
    },
    blog: {
      kicker: 'The blog',
      title: 'Training tips',
      lead: 'Articles written by our coaches, to help you train better and skip the classic mistakes.',
    },
  },

  disciplines: [
    {
      slug: 'musculation',
      name: 'Weight training',
      tagline: 'Strength, size, definition',
      short: 'Free weights, guided machines, and a floor big enough that you never queue.',
      description:
        'The core of both clubs. Squat racks, adjustable benches, dumbbells up into the heavy end, cables and guided machines for every muscle group. A coach walks the floor to fix positions and set your loads.',
      bullets: [
        'Enough racks, benches and olympic bars to go around',
        'Dumbbells in 2 kg steps up to heavy loads',
        'A bulking or cutting programme depending on your goal',
        'Loads and measurements tracked every month',
      ],
      image: 'discipline-musculation',
      level: 'All levels',
      duration: 'Open access',
    },
    {
      slug: 'cross-training',
      name: 'Cross training',
      tagline: 'Intense, varied, never the same twice',
      short: 'Full-body conditioning in short, hard circuits.',
      description:
        'Sessions that blend weightlifting, gymnastics and cardio into a timed format. Every movement has a scaled version, so a beginner and an athlete can do the same session side by side at their own level.',
      bullets: [
        'Coached sessions in small groups',
        'Kettlebells, ropes, tyres, rings and boxes',
        'Every movement scaled to your level',
        'Excellent for fat loss and conditioning',
      ],
      image: 'discipline-cross-training',
      level: 'Scaled for everyone',
      duration: '60 min',
    },
    {
      slug: 'cardio',
      name: 'Cardio',
      tagline: 'Conditioning, endurance, fat loss',
      short: 'Treadmills, bikes, rowers and ellipticals — with protocols that actually work.',
      description:
        'A complete cardio zone and, more importantly, someone to tell you what to do in it. Walking for an hour while looking at your phone burns very little; we give you short, effective interval protocols instead.',
      bullets: [
        'Treadmills, bikes, rowers, ellipticals',
        'HIIT and base endurance protocols',
        'Progress tracked by heart rate',
        'Ideal alongside weight training',
      ],
      image: 'discipline-cardio',
      level: 'All levels',
      duration: 'Open access',
    },
    {
      slug: 'boxe',
      name: 'Boxing & combat sports',
      tagline: 'Technique, reflexes, confidence',
      short: 'Bags, pads and technical work under a coach’s eye.',
      description:
        'Footwork, combinations, bag work and pads. You learn to punch cleanly before you punch hard — that is how you progress without wrecking your wrists and shoulders.',
      bullets: [
        'Heavy bags, speed balls, focus pads',
        'Technical work and movement',
        'Combat-specific conditioning',
        'No experience needed to start',
      ],
      image: 'discipline-boxe',
      level: 'Beginner to advanced',
      duration: '60 min',
    },
    {
      slug: 'fitness-femmes',
      name: 'Women’s fitness',
      tagline: 'Your space, your slots, your pace',
      short: 'Dedicated area and hours, female coaching, nobody staring.',
      description:
        'A lot of women want to train seriously without feeling watched. So there is a dedicated area and reserved time slots, with coaching that understands the specific goals — strength, toning, getting back in shape after pregnancy.',
      bullets: [
        'Dedicated women’s area and reserved slots',
        'Female coaching',
        'Strength, toning, return to fitness',
        'Group aerobics and stretching classes',
      ],
      image: 'discipline-fitness-femmes',
      level: 'All levels',
      duration: '45–60 min',
    },
    {
      slug: 'aerobic',
      name: 'Aerobics & group classes',
      tagline: 'Music, a group, good mood',
      short: 'Group classes that fly by and still make you sweat.',
      description:
        'Aerobics, step, stretching and conditioning to music. The group format has one advantage nothing else replaces: you turn up because the group is waiting for you.',
      bullets: [
        'Several classes every week',
        'Aerobics, step, stretching, conditioning',
        'Included in every membership',
        'Motivating group atmosphere',
      ],
      image: 'discipline-aerobic',
      level: 'All levels',
      duration: '45 min',
    },
    {
      slug: 'coaching-personnel',
      name: 'Personal training',
      tagline: 'One coach, just for you',
      short: 'One-to-one support, programme and nutrition included.',
      description:
        'For a specific goal with a date on it — a competition, significant weight loss, a return after injury. One-to-one sessions, a written programme, nutrition adjustments and measurement tracking.',
      bullets: [
        'One-to-one sessions',
        'Written programme, revised monthly',
        'Nutrition advice suited to Morocco',
        'Measurements and performance tracked',
      ],
      image: 'discipline-coaching',
      level: 'Tailored',
      duration: '60 min',
    },
  ],

  amenities: {
    musculation: 'Weights floor',
    cardio: 'Cardio zone',
    crossTraining: 'Cross training area',
    fitnessFemmes: 'Women’s area',
    aerobic: 'Group class studio',
    coaching: 'Personal training',
    vestiaires: 'Changing rooms',
    douches: 'Hot showers',
    parking: 'Parking',
    wifi: 'Free Wi-Fi',
    climatisation: 'Air conditioning',
    boutique: 'Shop & supplements',
  },

  plans: {
    seance: {
      name: 'Single session',
      tagline: 'To try it out, or for visitors passing through',
      features: ['Full gym access', 'That day’s group classes', 'Changing rooms and showers', 'No commitment'],
    },
    mensuel: {
      name: 'Monthly',
      tagline: 'The one most people choose',
      features: [
        'Open access for one month',
        'All group classes included',
        'Assessment and personal programme',
        'Measurement tracking',
        'No joining fee',
      ],
    },
    trimestriel: {
      name: 'Quarterly',
      tagline: 'Three months — long enough to become a habit',
      features: [
        'Open access for three months',
        'All group classes included',
        'Assessment and personal programme',
        'Programme reviewed every month',
        'Reduced rate',
      ],
    },
    annuel: {
      name: 'Annual',
      tagline: 'Best value by a clear margin',
      features: [
        'Open access for a year',
        'All group classes included',
        'Assessment and personal programme',
        'Monthly check-in with a coach',
        'Lowest monthly rate',
      ],
    },
    coaching: {
      name: 'Personal training',
      tagline: 'One-to-one support',
      features: [
        'One-to-one sessions',
        'Written, personalised programme',
        'Nutrition advice',
        'Close progress tracking',
        'Gym membership included',
      ],
    },
  },

  pages: {
    clubs: {
      seo: {
        title: 'Our gyms in Berrechid',
        description:
          'The two Fitness Hamouchi clubs in Berrechid: addresses, opening hours, equipment and the disciplines taught at each gym. Open 7 days a week.',
      },
      titlePattern: '{name} — Gym in {city}',
      descPattern:
        '{name}: address, opening hours, equipment and the disciplines taught at this gym in {city}. Open 7 days a week, first session free.',
      kicker: 'Our locations',
      title: 'Two clubs, one standard',
      lead: 'Pick whichever is closer to you. Both are equipped for weights and cardio, each with its own speciality.',
    },
    disciplines: {
      seo: {
        title: 'Classes: weights, cross training, boxing',
        description:
          'Weight training, cross training, cardio, boxing, women’s fitness and aerobics in Berrechid. Every discipline is included in your membership.',
      },
      kicker: 'Disciplines',
      title: 'Everything is included in your membership',
      lead:
        'Seven ways to train with us, and none of them costs extra. Switch discipline whenever you want, combine them if that suits you.',
    },
    pricing: {
      seo: {
        title: 'Pricing and memberships',
        description:
          'Clear pricing for our gyms in Berrechid: single session, monthly, quarterly or annual membership. Everything included, no joining fee.',
      },
      kicker: 'Pricing',
      title: 'Our memberships',
      lead:
        'One price, everything in it. Open access, group classes, changing rooms, showers and coaching on the floor — nothing billed on top.',
      includedTitle: 'Included in every membership',
      included: [
        'Open access for the whole membership period',
        'Every scheduled group class',
        'Starting assessment and written programme',
        'Changing rooms, lockers and hot showers',
        'Advice from a coach on the floor',
        'No joining fee and no admin fee',
      ],
      notesTitle: 'Good to know',
      notes: [
        'Prices are in Moroccan dirhams, per person.',
        'Reduced rates for students and group sign-ups — just ask.',
        'Payment is taken at the club reception, in cash or by card.',
        'The trial session is free and carries no obligation.',
      ],
    },
    coach: {
      seo: {
        title: 'Khalid Hamouchi, personal trainer',
        description:
          'Khalid Hamouchi, founder of Fitness Hamouchi Gym, has coached in Berrechid for over ten years. Meet the team and read our coaching method.',
      },
      kicker: 'The team',
      title: 'The people who will train you',
      lead: 'A gym is, before anything else, whoever is on the floor with you.',
      methodTitle: 'Our method, in four principles',
      method: [
        {
          title: 'Technique before load',
          body:
            'No weight goes on the bar until the movement is clean. That is slower for the first two weeks and much faster over the next two years.',
        },
        {
          title: 'A written programme, not improvisation',
          body:
            'Every member leaves with a programme on paper, matched to their goal, their level and the number of sessions they can realistically do each week.',
        },
        {
          title: 'Numbers, not impressions',
          body:
            'We measure loads, waist circumference and performance. It is the only way to know whether a programme is working, and to fix it when it is not.',
        },
        {
          title: 'We correct you, even unasked',
          body:
            'If your back rounds on a deadlift, a coach will come and tell you. That is the job, and it is what prevents the injuries that stop everything for six months.',
        },
      ],
    },
    gallery: {
      seo: {
        title: 'Photo gallery of our gyms',
        description:
          'Photos of our two gyms in Berrechid: weights floor, cardio zone, cross training area, changing rooms and group classes.',
      },
      kicker: 'In pictures',
      title: 'Our clubs in photos',
      lead: 'The equipment, the spaces and the atmosphere. Visiting in person is still the better option.',
    },
    contact: {
      seo: {
        title: 'Contact and directions',
        description:
          'Contact Fitness Hamouchi Gym in Berrechid: phone, WhatsApp, addresses of both clubs, opening hours and directions.',
      },
      kicker: 'Contact',
      title: 'Come and see us, or write',
      lead:
        'The simplest thing is to come to the club: we will show you around and you train once for free. Otherwise, WhatsApp is where we reply fastest.',
      formTitle: 'Write to us',
      formNote:
        'This form opens your mail app with the message already filled in. For an immediate reply, use WhatsApp.',
      form: {
        name: 'Name',
        namePlaceholder: 'Your name',
        phone: 'Phone',
        phonePlaceholder: '06 00 00 00 00',
        club: 'Preferred club',
        goal: 'Your goal',
        goals: [
          'Weight loss',
          'Building muscle',
          'Getting back in shape',
          'Athletic conditioning',
          'Personal training',
          'Not sure yet',
        ],
        message: 'Message',
        messagePlaceholder: 'Tell us in a few words what you are looking for…',
        submit: 'Send message',
        whatsappInstead: 'Or message us directly on WhatsApp',
      },
      hoursTitle: 'Opening hours',
      findUsTitle: 'Finding us',
    },
    blog: {
      seo: {
        title: 'Training and nutrition tips',
        description:
          'Articles by the coaches at Fitness Hamouchi Gym in Berrechid: training programmes, technique, nutrition and advice for beginners.',
      },
      kicker: 'The blog',
      title: 'Training tips',
      lead: 'What our coaches repeat most often on the floor, written down so you can come back to it.',
    },
    notFound: {
      seo: { title: 'Page not found', description: 'This page does not exist or has been moved.' },
      title: 'This page does not exist',
      lead: 'The link may be broken, or the page may have moved. Here is where to go next.',
      cta: 'Back to home',
    },
  },

  faq: [
    {
      q: 'Where are your gyms in Berrechid?',
      a: 'We have two clubs in Berrechid: Fitness Hamouchi Gym and Club Nour. Both addresses, with directions and opening hours, are on the Our clubs page. Call us if you are not sure which one is closer to you.',
    },
    {
      q: 'Is the first session really free?',
      a: 'Yes. You come in, look around, do a full session with a coach and leave without signing anything. Just bring sports clothes, clean trainers and a towel.',
    },
    {
      q: 'How much does a membership cost?',
      a: 'All our prices are published on the Pricing page: single session, monthly, quarterly and annual. There is no joining fee and no admin fee, and group classes are included in every membership.',
    },
    {
      q: 'Do I need experience to start?',
      a: 'No, and most of our new members do not have any. When you join, a coach assesses your level, shows you the basic movements and gives you a written programme matched to the number of sessions you can do each week.',
    },
    {
      q: 'Is there a women-only area?',
      a: 'Yes. We have a dedicated area and reserved time slots for women, with female coaching. Group aerobics and conditioning classes are also scheduled in those slots.',
    },
    {
      q: 'What are your opening hours?',
      a: 'We open Monday to Friday from 6am to 11pm, Saturday from 8am to 10pm and Sunday from 9am to 2pm. Hours may change during Ramadan — we announce them on Instagram and Facebook.',
    },
    {
      q: 'Do you offer personal training?',
      a: 'Yes, as one-to-one sessions with a written programme, nutrition advice and measurement tracking. It is the right option for a specific goal with a date on it, such as significant weight loss or a return after injury.',
    },
    {
      q: 'What should I bring to train?',
      a: 'Sports clothes, a clean pair of trainers kept for the gym, a towel and a water bottle. Changing rooms, lockers and hot showers are included in your membership.',
    },
  ],

  articles: [
    {
      slug: 'choisir-salle-de-sport-berrechid',
      date: '2026-01-14',
      updated: '2026-09-02',
      image: 'article-choisir-salle',
      seoTitle: 'How to choose a gym in Berrechid',
      title: 'How to choose a gym in Berrechid: 7 concrete criteria',
      description:
        'Equipment, coaching, hours, cleanliness, pricing: the seven things to check before signing a gym membership in Berrechid.',
      targets: ['gym berrechid', 'choosing a gym', 'best gym berrechid'],
      body: `
<p>Berrechid now has around ten gyms, and they are not equal. Before signing a membership — especially an annual one — here are the seven things we suggest you check, even if it ends up being at a competitor.</p>

<h2>1. The equipment available at the hours you actually train</h2>
<p>A gym can look perfectly equipped at 3pm and become unusable at 7pm. Visit at the time you genuinely intend to train, and count the essential stations: how many squat racks, how many adjustable benches, do the dumbbells go high enough for where you will be in six months.</p>
<p>One rack for forty people at peak hour means thirty minutes of waiting per session.</p>

<h2>2. Whether a coach is actually on the floor</h2>
<p>This is the criterion that makes the biggest difference over a year, and the easiest to check: during your visit, just look at where the coach is. On the floor fixing positions, or behind the desk on their phone?</p>
<p>A present coach saves you from the two things that stop beginners: a lower-back injury, and six months of training with no result because the execution was wrong.</p>

<h2>3. The state of the changing rooms and showers</h2>
<p>Changing rooms are a good proxy for how a club is run overall. If the showers are cold or dirty in the middle of the day, ask yourself what is happening to the equipment maintenance you can see less of.</p>

<h2>4. The hours, honestly</h2>
<p>Check the opening time and, more importantly, the real closing time — some gyms start switching lights off twenty minutes before the posted hour. If you work shifts, this is the criterion that decides whether you come three times a week or twice a month.</p>
<p>Both our clubs open at 6am on weekdays and close at 11pm for exactly this reason. Detailed hours for each club are on the {{clubs}} page.</p>

<h2>5. What the price actually includes</h2>
<p>A 200-dirham membership that bills group classes separately costs more than an all-inclusive one at 250. Ask the questions in order: joining fee, admin fee, group classes, access to other locations, starting assessment.</p>
<p>Also ask what happens if you go away for three weeks, and whether the membership auto-renews. Our prices, and what they include, are published on the {{pricing}} page.</p>

<h2>6. A starting programme, or none</h2>
<p>A serious gym does not leave you wandering between machines on day one. Ask whether joining includes an assessment and a written programme, and what it is based on: your goal, your level, and above all the number of sessions you can sustain each week.</p>
<p>A five-session programme handed to someone who can come twice a week is useless.</p>

<h2>7. The atmosphere, at peak hour</h2>
<p>This one is subjective, and yet it is what makes you keep coming or quit after six weeks. Does anyone say hello? Do people re-rack their weights? Do you feel like you belong there?</p>
<p>For women, add a direct question: is there a dedicated area or reserved slots, and female coaching?</p>

<h2>The test that covers all of it</h2>
<p>Ask for a free trial session. A gym that will not let you try before you pay is telling you something important about what comes next.</p>
<p>Ours is free, complete and carries no obligation: you look around, you train with a coach, you leave. {{contact}} to pick a slot.</p>
`,
    },
    {
      slug: 'programme-musculation-debutant',
      date: '2026-02-20',
      updated: '2026-08-18',
      image: 'article-programme-debutant',
      seoTitle: 'Beginner weight training programme',
      title: 'Beginner weight training programme: your first 4 weeks',
      description:
        'A beginner weight training programme over four weeks, three sessions a week: exercises, sets, reps, and the mistakes to avoid at the start.',
      targets: ['beginner weight training programme', '3 day workout programme', 'starting weight training'],
      body: `
<p>Most beginners make the same mistake: copying an advanced lifter’s programme found online. Five sessions a week, fifteen exercises per session, and quitting after a month. Here is what we actually hand to our new members.</p>

<h2>The principle: three sessions, whole body</h2>
<p>In your first weeks, progress does not come from training volume but from learning the movement. Your nervous system is learning to recruit muscles in the right order, and that happens fast — which is why beginners improve so quickly.</p>
<p>Three full-body sessions a week, with a rest day between each, is plenty. Monday, Wednesday, Friday, for example.</p>

<h2>The session, in order</h2>
<p>The same six exercises every session. The repetition is deliberate: you repeat in order to learn.</p>
<ol>
  <li><strong>Squat</strong> — 3 sets of 8 reps</li>
  <li><strong>Bench press</strong> or machine press — 3 × 8</li>
  <li><strong>Row</strong> (horizontal pull) — 3 × 10</li>
  <li><strong>Shoulder press</strong> — 3 × 10</li>
  <li><strong>Romanian deadlift</strong> — 3 × 10</li>
  <li><strong>Plank</strong> — 3 × 30 seconds</li>
</ol>
<p>Two minutes between sets on the first three exercises, ninety seconds on the rest. Time them on your phone: most beginners rest too little and end up dropping the weight.</p>

<h2>Choosing your load</h2>
<p>Start lighter than your ego suggests. The right starting weight is one where you could do two or three more reps than planned while keeping the execution perfect.</p>
<p>After that the rule is simple: when you complete all sets at the planned reps without your technique degrading, add roughly 2.5 kg next session. That is it. This slow, steady progression will beat any complicated programme.</p>

<h2>The four weeks, in practice</h2>
<p><strong>Week 1</strong> — Light loads. The only aim is to learn the six movements. Get corrected on every one of them.</p>
<p><strong>Week 2</strong> — Same exercises, slightly heavier. You will be sore: that is normal, and it fades.</p>
<p><strong>Week 3</strong> — Technique starts becoming automatic. Push the loads up more clearly on the squat and the row.</p>
<p><strong>Week 4</strong> — Write down your loads on every exercise. That is your reference point for the next programme, which can move to four sessions and split upper and lower body.</p>

<h2>The mistakes that cost the most</h2>
<p><strong>Changing programme every two weeks.</strong> An average programme followed for three months beats an excellent one followed for ten days.</p>
<p><strong>Skipping legs.</strong> It is the muscle group that drives the biggest hormonal response and changes a physique the most.</p>
<p><strong>Neglecting sleep and protein.</strong> Muscle is built during recovery. Seven to eight hours of sleep, and a protein source at every meal, will do more for you than any supplement.</p>
<p><strong>Training without ever being corrected.</strong> You cannot see your own back rounding on a deadlift. Someone has to see it for you.</p>

<h2>What comes next</h2>
<p>After four to six weeks this programme has done its job and needs to evolve. That is the point to move to four sessions, add volume and pick a direction: building muscle or losing fat.</p>
<p>In Berrechid we hand out this assessment and programme with every membership, and revise it monthly. See our {{disciplines}} for what comes next, or {{contact}} to come in for a free trial session.</p>
`,
    },
    {
      slug: 'prix-salle-de-sport-maroc',
      date: '2026-03-11',
      updated: '2026-09-20',
      image: 'article-prix-salle',
      seoTitle: 'Gym prices in Morocco in 2026',
      title: 'Gym prices in Morocco in 2026: what to expect',
      description:
        'How much does a gym membership cost in Morocco in 2026? Price ranges by city and type of club, plus the hidden fees worth checking.',
      targets: ['gym prices morocco', 'gym membership cost morocco', 'gym price berrechid'],
      body: `
<p>“How much is it?” is the first question we get on the phone, and the answer varies enormously between clubs. Here are the real ranges in the Moroccan market in 2026, and more usefully, how to compare two offers that do not include the same things.</p>

<h2>Three segments of the market</h2>
<p><strong>Neighbourhood gyms</strong> — Expect 150 to 300 dirhams a month. Essential equipment, a weights floor, a cardio zone. Quality depends almost entirely on the coaching: two gyms at the same price can be completely different experiences depending on whether a coach is present.</p>
<p><strong>Mid-range clubs</strong> — Between 300 and 600 dirhams a month. Fuller, more regularly renewed equipment, a group class schedule, often a women’s area and air conditioning that works.</p>
<p><strong>Premium clubs and chains</strong> — From 600 to 1,500 dirhams a month, mostly in Casablanca, Rabat and Marrakech. Pool, spa, studio classes, a booking app.</p>

<h2>What the city changes</h2>
<p>In Casablanca and Rabat, rent pushes prices up: a mid-range club there often starts where a good provincial club tops out. In mid-sized cities like Berrechid, Settat or El Jadida, you can find serious coaching between 200 and 350 dirhams a month.</p>
<p>That is the real trade-off for many people in Berrechid: pay more and add forty minutes of driving towards Casablanca, or train locally in a well-equipped club.</p>

<h2>The fees that are not in the advertised price</h2>
<p>A monthly price means nothing until you have asked these:</p>
<ul>
  <li><strong>Joining or admin fee</strong> — 0 to 300 dirhams one-off, rarely mentioned unprompted.</li>
  <li><strong>Group classes</strong> — included, or billed per session? This is the most common gap between two offers that look identical.</li>
  <li><strong>Assessment and starting programme</strong> — free, or sold as a coaching add-on?</li>
  <li><strong>Locker and towel</strong> — free or a monthly extra.</li>
  <li><strong>Auto-renewal</strong> — check the notice period before signing a twelve-month commitment.</li>
</ul>

<h2>Monthly or annual?</h2>
<p>An annual membership generally costs the equivalent of eight to ten months, so 20 to 30% less. That is worth taking on one condition: being already sure of your consistency.</p>
<p>Our advice to beginners is to start with a month or a quarter. First confirm you really do come three times a week, then move to annual knowing what you are buying. An honest gym will tell you the same thing.</p>

<h2>How to compare two offers properly</h2>
<p>Reduce everything to cost per session actually attended. A 250-dirham membership used twelve times a month works out at 21 dirhams a session. The same membership used four times costs 62.</p>
<p>Which means the most important factor in the price is not the price: it is everything that makes you come back. Proximity, hours that fit your job, a coach who knows you, equipment free at 7pm.</p>

<h2>Our prices in Berrechid</h2>
<p>We publish our prices openly, all-inclusive and with no joining fee: open access, group classes, starting assessment, written programme, changing rooms and showers. The detail is on the {{pricing}} page.</p>
<p>And because no price table replaces a visit, the first session is free with no obligation. {{contact}} to book a slot, or just drop into one of our {{clubs}}.</p>
`,
    },
  ],

  footer: {
    tagline: 'Two gyms in Berrechid. Weight training, cross training, cardio, boxing and women’s fitness.',
    builtNote: 'Gym in Berrechid, Casablanca-Settat region, Morocco.',
  },
};
