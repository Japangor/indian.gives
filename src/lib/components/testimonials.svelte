<script lang="ts">
	import Marquee from 'svelte-fast-marquee';
  
	const testimonials = [
	  {
		name: 'Rajesh Sharma',
		title: 'Spiritual Seeker',
		location: 'Mumbai, India',
		testimony: 'The Gita AI has transformed my understanding of dharma and karma. It\'s like having a personal spiritual guide who can explain complex verses in simple terms.',
		img: '/testimonials/seeker1.webp'
	  },
	  {
		name: 'Priya Patel',
		title: 'Yoga Instructor',
		location: 'Rishikesh, India',
		testimony: 'As a yoga teacher, I use this platform to deepen my students\' understanding of the Gita\'s wisdom. The AI provides beautiful insights that resonate with modern life.',
		img: '/testimonials/seeker2.webp'
	  },
	  {
		name: 'Arun Gupta',
		title: 'Business Professional',
		location: 'Bangalore, India',
		testimony: 'Finding balance in corporate life was challenging until I discovered this platform. The Gita\'s teachings, explained through AI, have helped me maintain peace amidst chaos.',
		img: '/testimonials/seeker3.webp'
	  },
	  {
		name: 'Swami Atmajnananda',
		title: 'Spiritual Guide',
		location: 'Varanasi, India',
		testimony: 'This platform beautifully bridges ancient wisdom with modern technology. The AI\'s interpretations are remarkably aligned with traditional teachings while being accessible to today\'s seekers.',
		img: '/testimonials/seeker4.webp'
	  },
	  {
		name: 'Meera Krishnan',
		title: 'Author & Meditation Teacher',
		location: 'Kerala, India',
		testimony: 'The depth of understanding this AI provides is remarkable. It helps me prepare for my meditation sessions by providing relevant verses and practical interpretations.',
		img: '/testimonials/seeker5.webp'
	  },
	  {
		name: 'Dr. Amit Singh',
		title: 'Professor of Philosophy',
		location: 'Delhi University, India',
		testimony: 'As an academic, I\'m impressed by the accuracy and depth of the AI\'s responses. It\'s a valuable tool for both scholars and spiritual practitioners.',
		img: '/testimonials/seeker6.webp'
	  }
	];
  </script>
  
  <div class="hidden md:block">
	<Marquee
	  gradient
	  speed={20}
	  gap={'2rem'}
	  pauseOnHover
	  class="w-full items-center py-10"
	  style="--gradientColor: rgb(255, 248, 240); --gradientWidth: 2%;"
	>
	  {#each testimonials as { name, title, location, testimony, img }, i (i)}
		<div class="testimonial">
		  <div class="absolute top-3 flex items-center gap-1">
			<span class="text-primary font-semibold">Divine Experience</span>
		  </div>
		  
		  <div class="text-center text-lg font-medium mt-3">
			<p class="text-gray-700">"{testimony}"</p>
		  </div>
		  
		  <div class="flex flex-col items-start gap-3 text-left md:flex-row">
			<div class="avatar-wrapper">
			
			</div>
			<div>
			  <h3 class="pt-1 md:pt-0 text-primary">{name}</h3>
			  <p class="font-medium text-gray-700">{title}</p>
			  <p class="font-medium text-gray-600">{location}</p>
			</div>
		  </div>
		</div>
	  {/each}
	</Marquee>
  </div>
  
  <div class="mt-7 space-y-5 md:hidden">
	{#each testimonials as { name, title, location, testimony, img }, i (i)}
	  <div class="testimonial">
		<div class="absolute top-3 flex items-center gap-1">
		  <span class="text-primary font-semibold">Divine Experience</span>
		</div>
		
		<div class="text-center text-lg font-medium">
		  <p class="text-gray-700">"{testimony}"</p>
		</div>
		
		<div class="flex items-start gap-5 text-left">
		  <div class="avatar-wrapper">
			<!-- <img
			  src={img}
			  alt={name}
			  width="48"
			  height="48"
			  class="avatar-image"
			/> -->
		  </div>
		  <div>
			<h3 class="pt-1 text-primary">{name}</h3>
			<p class="font-medium text-gray-700">{title}</p>
			<p class="font-medium text-gray-600">{location}</p>
		  </div>
		</div>
	  </div>
	{/each}
  </div>
  
  <style lang="scss">
	.avatar-wrapper {
	  @apply relative w-12 h-12 rounded-full overflow-hidden 
			 border-2 border-primary/20 bg-orange-50;
	}
  
	.avatar-image {
	  @apply w-full h-full object-cover rounded-full 
			 transition-transform hover:scale-105;
	}
  
	.testimonial {
	  @apply relative flex w-full max-w-sm flex-col gap-7 
			 rounded-xl border-2 border-primary/10 bg-white/90 
			 p-5 pt-12 shadow-lg transition-all backdrop-blur-sm
			 hover:border-primary hover:shadow-primary/10
			 md:w-auto md:p-7;
  
	  h3 {
		@apply font-bold text-lg;
	  }
	}
  
	:global(.svelte-marquee-container) {
	  @apply my-8;
	}
  
	:global(.svelte-marquee) {
	  @apply gap-6;
	}
  </style>