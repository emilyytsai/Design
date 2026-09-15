// Case study content for the project showcase.
// Copy is written from the project details already in this repo (readme blurbs,
// tech stacks, hackathon results, roles). Swap in real research artifacts and
// metrics as they become available.

export interface CaseStudyLink {
	label: string;
	href: string;
}

export interface CaseStudy {
	id: string;
	title: string;
	tagline: string;
	image: string;
	tags: string[];
	size: 'featured' | 'standard';
	accent: string; // tailwind-friendly hex used for accents on the card + modal
	links: CaseStudyLink[];
	problem: string;
	research: string[];
	iteration: string[];
	solution: string;
	impact: string[];
}

export const caseStudies: CaseStudy[] = [
	{
		id: 'sonarpath',
		title: 'SonarPath',
		tagline: 'Real-time sea routing that visualizes underwater noise impact',
		image: '/project-1.png',
		tags: ['React', 'Vite', 'TypeScript', 'ArcGIS Maps SDK', 'Gemini API'],
		size: 'featured',
		accent: '#a07fd4',
		links: [
			{ label: 'Demo', href: 'https://sonarpath.vercel.app/' },
			{ label: 'Devpost', href: 'https://devpost.com/software/sonarpath' }
		],
		problem:
			"Commercial shipping lanes cut straight through critical marine mammal habitats, and captains plotting a route have no way to see the acoustic impact of their path before setting sail. At FullyHacks 2026, our team set out to make that invisible cost visible.",
		research: [
			'Route-planning tools show distance and fuel cost, but nothing about underwater noise pollution.',
			'Marine conservation data (whale migration corridors, noise-sensitivity zones) exists, but lives in disconnected, hard-to-read scientific datasets.',
			'Anyone without a GIS background needed a way to compare routes side by side without learning the underlying data.'
		],
		iteration: [
			'Sketched three interaction models for comparing routes before settling on a split map + score view.',
			'Integrated the ArcGIS Maps SDK to plot real bathymetric and marine-traffic data, iterating on how to layer noise-impact zones without cluttering the map.',
			'Used the Gemini API to translate raw noise-impact scores into plain-language route summaries non-experts could read at a glance.'
		],
		solution:
			'A real-time sea routing tool: drop a start and end port, get multiple route options, and see each one scored and visualized by its underwater noise footprint, with an AI-generated summary explaining the trade-offs in plain language.',
		impact: [
			'Won Best Social Impact & Sustainability at FullyHacks 2026.',
			'Owned the ArcGIS map integration and the UI/UX for the routing and comparison experience.'
		]
	},
	{
		id: 'nodebud',
		title: 'NodeBud',
		tagline: 'An AI mock-interview platform, designed from wireframe to shipped design system',
		image: '/project-2.png',
		tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui'],
		size: 'featured',
		accent: '#4D7BF0',
		links: [
			{ label: 'Demo', href: 'https://nodebud.vercel.app/' },
			{ label: 'Devpost', href: 'https://devpost.com/software/nodebud' }
		],
		problem:
			'Students preparing for technical interviews mostly get practice from friends or paid platforms. There was no free, low-pressure space to rehearse a full interview flow and get structured feedback.',
		research: [
			"Talked with peers in ACM about what made past mock-interview practice frustrating: scheduling friction, generic questions, no way to review how you actually answered.",
			'Sketched the core flow (start interview, answer, review) and walked it through with teammates before writing UI code.',
			'Ran informal usability passes on early wireframes with peers to catch confusing steps before build.'
		],
		iteration: [
			'Moved from wireframes to a shadcn/ui + Tailwind component library so the interview flow, feedback screens, and dashboard shared one visual language.',
			'Refined the design system through several rounds of peer usability testing, tightening flows testers stumbled on.'
		],
		solution:
			'A Next.js/React web app that walks a student through a mock interview and structured feedback, built on a reusable design system designed and implemented end-to-end.',
		impact: [
			'Owned the full UI/UX design and frontend build, from wireframes to a shipped, reusable design system.',
			"Used as ACM Node Buds' interview-practice tool."
		]
	},
	{
		id: 'oddinary-farm',
		title: 'Oddinary Farm',
		tagline: 'A consistent and reusable UI animation system for a game shipped on Steam',
		image: '/game-5.png',
		tags: ['Unity', 'C#', 'GitHub'],
		size: 'standard',
		accent: '#EB9F3D',
		links: [
			{ label: 'Steam', href: 'https://store.steampowered.com/app/3848990/Oddinary_Farm/' },
			{ label: 'Discord', href: 'https://discord.gg/k5CdXyMwHm' }
		],
		problem:
			"The game's UI needed consistent, readable button states across dozens of menus without slowing down a small dev team.",
		research: [
			'Playtesters kept losing track of which buttons were interactive vs. decorative in early menu passes.'
		],
		iteration: [
			'Built a reusable set of UI button animation classes so every menu inherits the same hover/press feedback automatically.'
		],
		solution:
			'A shared UI animation system layered across every menu, plus oversight of development workflows and creative direction.',
		impact: ['Shipped and listed on Steam.']
	},
	{
		id: 'country-life-cafe',
		title: 'Country Life Cafe',
		tagline: 'Procedural difficulty scaling tuned from real playtest drop-off',
		image: '/game-3.png',
		tags: ['Unity', 'C#', 'GitHub'],
		size: 'standard',
		accent: '#85969E',
		links: [{ label: 'GitHub', href: 'https://github.com/emilyytsai/CountryLifeCafe' }],
		problem:
			'As lead, the game needed to stay engaging across a wide range of player skill without hand-tuning every level.',
		research: [
			'Early builds were either too easy or spiked in difficulty; team playtests surfaced exactly where players dropped off.'
		],
		iteration: [
			'Designed and implemented procedural difficulty scaling, then iterated on the curve using playtest drop-off points, alongside the core UI systems and gameplay loop.'
		],
		solution:
			'A cohesive gameplay loop with UI systems and a difficulty curve that adapts to how the player is doing, backed by a managed asset pipeline for a growing team.',
		impact: ['Led the development team from gameplay loop through asset integration.']
	},
	{
		id: 'out-of-this-world-cafe',
		title: 'Out of This World Cafe',
		tagline: 'A hackathon game where UI clarity had to happen fast',
		image: '/game-1.png',
		tags: ['Unity', 'C#', 'GitHub'],
		size: 'standard',
		accent: '#e9b4d9',
		links: [{ label: 'Devpost', href: 'https://devpost.com/software/out-of-this-world-cafe' }],
		problem:
			'At FullyHacks 2025, our team had 24 hours to make a game feel polished: mechanics, animation, and UI all had to click together fast.',
		research: [
			'Quick playtests between build sprints showed which mechanics read as fun immediately vs. which needed clearer UI signposting.'
		],
		iteration: [
			'Guided the process across game mechanics, animations, and UI/UX in tight feedback loops with the team.'
		],
		solution:
			'A polished hackathon game with cohesive UI/UX and gameplay systems, built under serious time pressure.',
		impact: ['Won Best Game at FullyHacks 2025.']
	},
	{
		id: 'wave-rave',
		title: 'Wave Rave',
		tagline: 'Tuning UI and enemy pacing so encounters feel fair',
		image: '/game-6.png',
		tags: ['Unity', 'C#', 'GitHub'],
		size: 'standard',
		accent: '#9CE2FF',
		links: [{ label: 'itch.io', href: 'https://pomjellies.itch.io/wave-rave' }],
		problem: 'The game needed clear UI and a balanced sense of challenge from its enemy encounters.',
		research: ['Early playthroughs showed spawn patterns that felt either too sparse or overwhelming.'],
		iteration: [
			'Implemented UI elements and menus, then iterated on the enemy spawning system to tune pacing.'
		],
		solution:
			'Polished UI/menus paired with a tuned enemy-spawn system that keeps encounters challenging but fair.',
		impact: ['Shipped and published on itch.io.']
	}
];
