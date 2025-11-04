export interface EducationArticle {
  articleId: string;
  title: string;
  category: 'GENERAL' | 'PREPARATION' | 'AFTERCARE' | 'ELIGIBILITY' | 'PROCESS' | 'IMPACT';
  summary: string;
  content: string;
  imageUrl?: string;
  readTime: number; // in minutes
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const mockEducation: EducationArticle[] = [
  {
    articleId: 'edu-001',
    title: 'Why Pet Blood Donation Matters',
    category: 'GENERAL',
    summary: 'Learn about the critical importance of pet blood donation and how it saves lives every day.',
    content: `# Why Pet Blood Donation Matters

Every year, thousands of pets require blood transfusions due to accidents, surgeries, or illnesses. Just like humans, pets can need blood to survive critical situations.

## The Need for Blood

- Emergency trauma cases
- Surgical procedures
- Cancer treatment
- Blood disorders
- Poisoning cases

## Your Pet Can Be a Hero

Healthy pets can donate blood and help save the lives of other animals in need. A single donation can help multiple pets, as blood can be separated into different components.

## Making a Difference

By becoming a blood donor, your pet joins an elite group of lifesavers. The process is safe, quick, and your pet will be helping others in their time of greatest need.`,
    imageUrl: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800',
    readTime: 3,
    tags: ['blood donation', 'importance', 'lifesaving'],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2025-10-01T00:00:00Z',
  },
  {
    articleId: 'edu-002',
    title: 'Preparing Your Dog for Blood Donation',
    category: 'PREPARATION',
    summary: 'Essential tips to prepare your dog for a successful blood donation appointment.',
    content: `# Preparing Your Dog for Blood Donation

Proper preparation ensures a smooth and successful donation experience for your dog.

## Before the Appointment

### 24-48 Hours Before
- Ensure your dog is well-hydrated
- Maintain normal diet and exercise routine
- Avoid strenuous activities

### Day of Donation
- Feed a full meal 2-3 hours before appointment
- Provide plenty of water
- Bring vaccination records
- Bring your dog's favorite treats

## What to Expect

The donation process typically takes 30-45 minutes:
1. Pre-donation health check
2. Blood collection (10-15 minutes)
3. Post-donation observation (15-20 minutes)

## After Donation

- Your dog may be slightly tired
- Encourage rest for the remainder of the day
- Provide plenty of water
- Avoid strenuous exercise for 24 hours`,
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
    readTime: 4,
    tags: ['dogs', 'preparation', 'appointment'],
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2025-09-15T00:00:00Z',
  },
  {
    articleId: 'edu-003',
    title: 'Cat Blood Donation: What You Need to Know',
    category: 'GENERAL',
    summary: 'Understanding the unique aspects of feline blood donation and why cats make excellent donors.',
    content: `# Cat Blood Donation: What You Need to Know

Cats can be excellent blood donors, though the process differs slightly from dogs.

## Feline Blood Types

Cats have three main blood types:
- **Type A** (most common)
- **Type B** (varies by breed)
- **Type AB** (rare)

## Sedation for Cats

Unlike dogs, cats typically require mild sedation for blood donation to ensure:
- Comfort during the procedure
- Safety for the cat and veterinary staff
- Adequate blood collection

## Eligibility Requirements

- Age: 1-8 years
- Weight: Minimum 10 lbs
- Indoor only
- Spayed/neutered (required)
- Current vaccinations
- FeLV/FIV negative

## The Process

1. Pre-donation exam
2. Mild sedation administered
3. Blood collection (5-10 minutes)
4. Recovery period (30-60 minutes)
5. Post-donation monitoring`,
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',
    readTime: 5,
    tags: ['cats', 'feline', 'blood types', 'sedation'],
    createdAt: '2024-03-05T00:00:00Z',
    updatedAt: '2025-10-10T00:00:00Z',
  },
  {
    articleId: 'edu-004',
    title: 'Equine Blood Donation: Large Animal Heroes',
    category: 'GENERAL',
    summary: 'How horses contribute to veterinary medicine through blood donation.',
    content: `# Equine Blood Donation: Large Animal Heroes

Horses are incredible blood donors, capable of providing large volumes that can help multiple equine patients.

## Why Horses Donate

- Emergency colic surgeries
- Severe anemia cases
- Neonatal foal care
- Research and plasma products

## Volume and Frequency

- Typical donation: 6-8 liters
- Frequency: Every 8 weeks
- Horses recover quickly due to their large blood volume

## Eligibility

- Age: 2-20 years
- Weight: Minimum 800 lbs
- Good health and temperament
- Negative Coggins test
- Current vaccinations

## The Process

1. Health examination
2. Mild sedation (if needed)
3. Blood collection (15-20 minutes)
4. Post-donation monitoring
5. Return to normal activities

## Special Considerations

- Transport arrangements may be needed
- Some facilities offer on-site collection
- Horses typically handle donation very well`,
    imageUrl: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800',
    readTime: 4,
    tags: ['horses', 'equine', 'large animals'],
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2025-09-20T00:00:00Z',
  },
  {
    articleId: 'edu-005',
    title: 'Understanding Blood Types in Pets',
    category: 'ELIGIBILITY',
    summary: 'A comprehensive guide to blood types in dogs, cats, and horses.',
    content: `# Understanding Blood Types in Pets

Just like humans, pets have different blood types that are important for safe transfusions.

## Dog Blood Types

Dogs have multiple blood types (DEA system):
- **DEA 1.1 Positive** (most common)
- **DEA 1.1 Negative** (universal donor)
- Other DEA types (1.2, 3, 4, 5, 7)

### Universal Donors
Dogs that are DEA 1.1 negative are universal donors and their blood is in high demand.

## Cat Blood Types

- **Type A** (90% of domestic cats)
- **Type B** (varies by breed, 1-25%)
- **Type AB** (rare, <1%)

### Important Note
Cats can have severe reactions to mismatched blood, making blood typing critical.

## Horse Blood Types

Horses have 8 major blood group systems:
- Aa, Ca, Da, Ka, Pa, Qa, Ua systems
- Testing determines compatibility

## Why It Matters

Knowing your pet's blood type:
- Ensures safe transfusions
- Helps match donors with recipients
- Prevents transfusion reactions
- Saves lives in emergencies`,
    imageUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800',
    readTime: 6,
    tags: ['blood types', 'science', 'compatibility'],
    createdAt: '2024-05-10T00:00:00Z',
    updatedAt: '2025-10-05T00:00:00Z',
  },
  {
    articleId: 'edu-006',
    title: 'The Donation Process: Step by Step',
    category: 'PROCESS',
    summary: 'A detailed walkthrough of what happens during a blood donation appointment.',
    content: `# The Donation Process: Step by Step

Understanding the donation process helps ease any concerns and ensures a smooth experience.

## Step 1: Check-In (5 minutes)
- Verify appointment details
- Review consent forms
- Answer any last-minute questions

## Step 2: Pre-Donation Exam (10 minutes)
- Weight check
- Temperature reading
- Heart rate and overall health assessment
- Review of medical history

## Step 3: Blood Collection (10-15 minutes)
- Pet is positioned comfortably
- Area is cleaned and prepped
- Blood is collected via jugular vein
- Continuous monitoring throughout

## Step 4: Post-Donation Care (15-20 minutes)
- Pressure applied to collection site
- Observation period
- Treats and praise
- Instructions for home care

## Step 5: Recovery
- Most pets return to normal immediately
- Some may be slightly tired
- Resume normal activities the next day

## Total Time
The entire process typically takes 45-60 minutes from arrival to departure.`,
    imageUrl: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800',
    readTime: 5,
    tags: ['process', 'procedure', 'what to expect'],
    createdAt: '2024-06-15T00:00:00Z',
    updatedAt: '2025-10-15T00:00:00Z',
  },
  {
    articleId: 'edu-007',
    title: 'Post-Donation Care for Your Pet',
    category: 'AFTERCARE',
    summary: 'How to care for your pet after they donate blood.',
    content: `# Post-Donation Care for Your Pet

Proper aftercare ensures your pet recovers quickly and comfortably.

## Immediately After Donation

### At the Facility
- Your pet will be monitored for 15-20 minutes
- Staff will ensure no bleeding at collection site
- Your pet may receive treats and water
- You'll receive aftercare instructions

### Going Home
- Keep your pet calm during transport
- Avoid excitement or stress
- Provide water if desired

## First 24 Hours

### Activity Level
- Encourage rest and relaxation
- Avoid strenuous exercise
- No running, jumping, or rough play
- Short, calm walks are fine

### Diet and Hydration
- Provide plenty of fresh water
- Feed normal diet
- Some pets may be extra hungry
- Monitor appetite

### Monitoring
- Check collection site for any swelling
- Watch for excessive tiredness (rare)
- Contact vet if concerns arise

## When to Call the Vet

Contact your veterinarian if you notice:
- Excessive bleeding or swelling
- Lethargy lasting more than 24 hours
- Loss of appetite
- Any unusual behavior

## Return to Normal

Most pets return to their normal routine within 24 hours and can resume all activities.`,
    imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
    readTime: 4,
    tags: ['aftercare', 'recovery', 'post-donation'],
    createdAt: '2024-07-20T00:00:00Z',
    updatedAt: '2025-10-20T00:00:00Z',
  },
  {
    articleId: 'edu-008',
    title: 'Eligibility Requirements: Is Your Pet Qualified?',
    category: 'ELIGIBILITY',
    summary: 'Detailed eligibility criteria for pet blood donors across all species.',
    content: `# Eligibility Requirements: Is Your Pet Qualified?

Not all pets can be blood donors. Here are the requirements for each species.

## Dogs

### Basic Requirements
- **Age:** 1-8 years
- **Weight:** Minimum 55 lbs (25 kg)
- **Health:** Good physical condition
- **Temperament:** Friendly and calm
- **Vaccinations:** Current on all core vaccines

### Medical Requirements
- Heartworm negative (tested within 12 months)
- No chronic medications (preventatives OK)
- Never received a blood transfusion
- No history of blood disorders

### Lifestyle
- Regular veterinary care
- Healthy diet
- Regular exercise

## Cats

### Basic Requirements
- **Age:** 1-8 years
- **Weight:** Minimum 10 lbs (4.5 kg)
- **Indoor Only:** Required
- **Spayed/Neutered:** Required
- **Vaccinations:** Current

### Medical Requirements
- FeLV/FIV negative
- No chronic medications
- Never been pregnant (for females)
- Good temperament for sedation

## Horses

### Basic Requirements
- **Age:** 2-20 years
- **Weight:** Minimum 800 lbs (363 kg)
- **Health:** Excellent condition
- **Temperament:** Calm and manageable

### Medical Requirements
- Negative Coggins test (within 12 months)
- EIA negative
- Current vaccinations
- No performance medications

## Donation Frequency

- **Dogs:** Every 8 weeks
- **Cats:** Every 8 weeks
- **Horses:** Every 8 weeks

## Temporary Disqualifications

Your pet may be temporarily ineligible if:
- Recent illness or injury
- Recent surgery
- Pregnant or nursing
- On certain medications
- Recent travel to endemic areas`,
    imageUrl: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800',
    readTime: 7,
    tags: ['eligibility', 'requirements', 'qualifications'],
    createdAt: '2024-08-05T00:00:00Z',
    updatedAt: '2025-10-25T00:00:00Z',
  },
  {
    articleId: 'edu-009',
    title: 'The Impact of Your Pet\'s Donation',
    category: 'IMPACT',
    summary: 'Real stories of how donated blood saves lives and makes a difference.',
    content: `# The Impact of Your Pet's Donation

Every donation makes a real, measurable difference in saving lives.

## By the Numbers

### One Dog Donation Can:
- Save up to 4 pets
- Provide red blood cells, plasma, and platelets
- Help emergency trauma cases
- Support surgical procedures

### One Cat Donation Can:
- Save 1-2 cats
- Provide critical care for anemia
- Support cancer treatment
- Help with blood disorders

### One Horse Donation Can:
- Save multiple horses
- Support emergency colic surgeries
- Help neonatal foals
- Provide plasma products

## Real-Life Impact

### Emergency Trauma
"A dog hit by a car needed immediate blood. Thanks to donors, we had the blood type ready and saved his life." - Dr. Sarah Mitchell

### Cancer Treatment
"Cats undergoing chemotherapy often need transfusions. Donor blood helps them complete their treatment." - Dr. James Rodriguez

### Surgical Support
"During complex surgeries, having blood available can mean the difference between life and death." - Dr. Lisa Park

## Your Pet's Legacy

Each donation is tracked and you'll receive updates on how your pet's blood was used to help others.

## Community Impact

Blood donor programs:
- Ensure emergency readiness
- Support veterinary research
- Build community awareness
- Save countless lives

## Join the Lifesaving Community

Your pet can be a hero. Every donation counts.`,
    imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800',
    readTime: 5,
    tags: ['impact', 'stories', 'lifesaving', 'community'],
    createdAt: '2024-09-10T00:00:00Z',
    updatedAt: '2025-10-28T00:00:00Z',
  },
  {
    articleId: 'edu-010',
    title: 'Frequently Asked Questions',
    category: 'GENERAL',
    summary: 'Answers to the most common questions about pet blood donation.',
    content: `# Frequently Asked Questions

## General Questions

### Is blood donation safe for my pet?
Yes! Blood donation is very safe. Pets are carefully screened, and the amount collected is a small percentage of their total blood volume.

### Will it hurt my pet?
The needle insertion may cause brief discomfort, similar to a vaccination. Most pets tolerate it very well.

### How long does it take?
The entire process takes 45-60 minutes, with actual blood collection taking only 10-15 minutes.

### How often can my pet donate?
Pets can safely donate every 8 weeks, allowing their body to fully replenish blood cells.

## Health Questions

### Will my pet be tired after donating?
Some pets may be slightly tired for a few hours, but most return to normal immediately.

### What if my pet has a reaction?
Adverse reactions are extremely rare. Veterinary staff monitor pets throughout the process.

### Does my pet need special food after donating?
No special diet is needed. Continue feeding your pet normally.

## Logistics

### Do I need an appointment?
Yes, blood donation is by appointment only to ensure proper staffing and preparation.

### Is there a cost?
Most programs are free for donors. Some even offer perks like free health screenings.

### Can I stay with my pet?
Policies vary by facility. Many allow owners to stay during the process.

### What if my pet doesn't qualify?
There are other ways to help, such as volunteering or spreading awareness.

## After Donation

### When can my pet exercise again?
Avoid strenuous activity for 24 hours. Normal activity can resume the next day.

### Will I know how the blood was used?
Many programs provide updates on how donations helped other pets.

### Can my pet donate again?
Yes! Regular donors are invaluable to the program.`,
    imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
    readTime: 6,
    tags: ['FAQ', 'questions', 'answers', 'information'],
    createdAt: '2024-10-01T00:00:00Z',
    updatedAt: '2025-11-01T00:00:00Z',
  },
];

export const getArticleById = (articleId: string): EducationArticle | undefined => {
  return mockEducation.find(article => article.articleId === articleId);
};

export const getArticlesByCategory = (category: EducationArticle['category']): EducationArticle[] => {
  return mockEducation.filter(article => article.category === category);
};

export const searchArticles = (query: string): EducationArticle[] => {
  const lowerQuery = query.toLowerCase();
  return mockEducation.filter(article =>
    article.title.toLowerCase().includes(lowerQuery) ||
    article.summary.toLowerCase().includes(lowerQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export const getFeaturedArticles = (limit: number = 3): EducationArticle[] => {
  return mockEducation.slice(0, limit);
};
