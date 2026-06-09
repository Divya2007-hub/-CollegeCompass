// prisma/seed.ts
// Seeds the database with 25 realistic Indian colleges

import { PrismaClient, CollegeType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const colleges = [
  {
    name: "Indian Institute of Technology Bombay",
    location: "Mumbai, Maharashtra",
    city: "Mumbai",
    state: "Maharashtra",
    fees: 250000,
    rating: 4.8,
    description:
      "IIT Bombay is one of India's premier engineering institutions, known for cutting-edge research, world-class faculty, and exceptional industry connections. Established in 1958, it has consistently ranked among the top engineering colleges globally.",
    placements: {
      averageSalary: 2100000,
      highestSalary: 25000000,
      placementRate: 98,
      topRecruiters: ["Google", "Microsoft", "Goldman Sachs", "McKinsey", "Amazon"],
    },
    established: 1958,
    website: "https://www.iitb.ac.in",
    accreditation: "NAAC A++",
    type: CollegeType.GOVERNMENT,
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
    courses: [
      { name: "Computer Science Engineering", duration: "4 Years", fees: 250000, seats: 120, degree: "B.Tech" },
      { name: "Electrical Engineering", duration: "4 Years", fees: 250000, seats: 90, degree: "B.Tech" },
      { name: "Mechanical Engineering", duration: "4 Years", fees: 250000, seats: 80, degree: "B.Tech" },
      { name: "Data Science & AI", duration: "2 Years", fees: 300000, seats: 60, degree: "M.Tech" },
    ],
  },
  {
    name: "Indian Institute of Technology Delhi",
    location: "New Delhi, Delhi",
    city: "New Delhi",
    state: "Delhi",
    fees: 240000,
    rating: 4.7,
    description:
      "IIT Delhi is a premier institution of national importance located in the heart of India's capital. Renowned for its research output, entrepreneurship culture, and outstanding placement record across all disciplines.",
    placements: {
      averageSalary: 2000000,
      highestSalary: 22000000,
      placementRate: 97,
      topRecruiters: ["Facebook", "Apple", "Uber", "Deutsche Bank", "Qualcomm"],
    },
    established: 1961,
    website: "https://www.iitd.ac.in",
    accreditation: "NAAC A++",
    type: CollegeType.GOVERNMENT,
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
    courses: [
      { name: "Computer Science Engineering", duration: "4 Years", fees: 240000, seats: 100, degree: "B.Tech" },
      { name: "Civil Engineering", duration: "4 Years", fees: 240000, seats: 70, degree: "B.Tech" },
      { name: "Chemical Engineering", duration: "4 Years", fees: 240000, seats: 60, degree: "B.Tech" },
      { name: "MBA", duration: "2 Years", fees: 350000, seats: 50, degree: "MBA" },
    ],
  },
  {
    name: "BITS Pilani",
    location: "Pilani, Rajasthan",
    city: "Pilani",
    state: "Rajasthan",
    fees: 550000,
    rating: 4.6,
    description:
      "Birla Institute of Technology and Science, Pilani is a deemed university offering top-tier engineering and science programs. Known for its unique Practice School program that provides industry exposure to students.",
    placements: {
      averageSalary: 1800000,
      highestSalary: 18000000,
      placementRate: 95,
      topRecruiters: ["Microsoft", "Samsung", "Schlumberger", "Goldman Sachs", "Oracle"],
    },
    established: 1964,
    website: "https://www.bits-pilani.ac.in",
    accreditation: "NAAC A",
    type: CollegeType.DEEMED,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    courses: [
      { name: "Computer Science Engineering", duration: "4 Years", fees: 550000, seats: 200, degree: "B.E." },
      { name: "Electronics & Communication", duration: "4 Years", fees: 550000, seats: 150, degree: "B.E." },
      { name: "Mathematics", duration: "4 Years", fees: 500000, seats: 80, degree: "B.Sc." },
      { name: "MBA", duration: "2 Years", fees: 650000, seats: 60, degree: "MBA" },
    ],
  },
  {
    name: "National Institute of Technology Trichy",
    location: "Tiruchirappalli, Tamil Nadu",
    city: "Tiruchirappalli",
    state: "Tamil Nadu",
    fees: 160000,
    rating: 4.5,
    description:
      "NIT Trichy is one of the premier National Institutes of Technology, consistently ranked among India's top engineering colleges. Known for its strong alumni network and excellent placement record.",
    placements: {
      averageSalary: 1500000,
      highestSalary: 15000000,
      placementRate: 94,
      topRecruiters: ["TCS", "Infosys", "Wipro", "L&T", "Cognizant"],
    },
    established: 1964,
    website: "https://www.nitt.edu",
    accreditation: "NAAC A++",
    type: CollegeType.GOVERNMENT,
    image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800",
    courses: [
      { name: "Computer Science Engineering", duration: "4 Years", fees: 160000, seats: 120, degree: "B.Tech" },
      { name: "Mechanical Engineering", duration: "4 Years", fees: 160000, seats: 100, degree: "B.Tech" },
      { name: "Electronics Engineering", duration: "4 Years", fees: 160000, seats: 90, degree: "B.Tech" },
    ],
  },
  {
    name: "VIT University",
    location: "Vellore, Tamil Nadu",
    city: "Vellore",
    state: "Tamil Nadu",
    fees: 420000,
    rating: 4.3,
    description:
      "VIT University is a private deemed university known for its world-class infrastructure, international collaborations, and strong industry ties. It hosts one of India's largest on-campus placements.",
    placements: {
      averageSalary: 1200000,
      highestSalary: 12000000,
      placementRate: 92,
      topRecruiters: ["Amazon", "Zoho", "Capgemini", "HCL", "Accenture"],
    },
    established: 1984,
    website: "https://vit.ac.in",
    accreditation: "NAAC A++",
    type: CollegeType.DEEMED,
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800",
    courses: [
      { name: "Computer Science Engineering", duration: "4 Years", fees: 420000, seats: 500, degree: "B.Tech" },
      { name: "Information Technology", duration: "4 Years", fees: 420000, seats: 300, degree: "B.Tech" },
      { name: "Biomedical Engineering", duration: "4 Years", fees: 400000, seats: 100, degree: "B.Tech" },
      { name: "MBA", duration: "2 Years", fees: 480000, seats: 120, degree: "MBA" },
    ],
  },
  {
    name: "Manipal Institute of Technology",
    location: "Manipal, Karnataka",
    city: "Manipal",
    state: "Karnataka",
    fees: 480000,
    rating: 4.2,
    description:
      "Manipal Institute of Technology is a constituent institution of Manipal Academy of Higher Education. Known for its diverse student community, excellent infrastructure, and strong international industry linkages.",
    placements: {
      averageSalary: 1100000,
      highestSalary: 10000000,
      placementRate: 90,
      topRecruiters: ["Wipro", "TCS", "IBM", "Infosys", "Deloitte"],
    },
    established: 1957,
    website: "https://manipal.edu/mit.html",
    accreditation: "NAAC A++",
    type: CollegeType.DEEMED,
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800",
    courses: [
      { name: "Computer Science Engineering", duration: "4 Years", fees: 480000, seats: 400, degree: "B.Tech" },
      { name: "Aeronautical Engineering", duration: "4 Years", fees: 500000, seats: 60, degree: "B.Tech" },
      { name: "Mechatronics", duration: "4 Years", fees: 480000, seats: 80, degree: "B.Tech" },
    ],
  },
  {
    name: "Indian Institute of Technology Madras",
    location: "Chennai, Tamil Nadu",
    city: "Chennai",
    state: "Tamil Nadu",
    fees: 260000,
    rating: 4.9,
    description:
      "IIT Madras is India's top-ranked institution with an unmatched research ecosystem, startup incubators, and deep industry partnerships. Set in a beautiful campus in Chennai, it leads in innovation and academic excellence.",
    placements: {
      averageSalary: 2200000,
      highestSalary: 28000000,
      placementRate: 99,
      topRecruiters: ["Google", "Microsoft", "Stripe", "Walmart Labs", "Tower Research"],
    },
    established: 1959,
    website: "https://www.iitm.ac.in",
    accreditation: "NAAC A++",
    type: CollegeType.GOVERNMENT,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
    courses: [
      { name: "Computer Science Engineering", duration: "4 Years", fees: 260000, seats: 110, degree: "B.Tech" },
      { name: "Aerospace Engineering", duration: "4 Years", fees: 260000, seats: 50, degree: "B.Tech" },
      { name: "Data Science", duration: "2 Years", fees: 320000, seats: 40, degree: "M.Tech" },
    ],
  },
  {
    name: "SRM Institute of Science and Technology",
    location: "Chennai, Tamil Nadu",
    city: "Chennai",
    state: "Tamil Nadu",
    fees: 380000,
    rating: 4.1,
    description:
      "SRM Institute is one of India's top-ranked private universities with multiple campuses. Known for its comprehensive programs, modern labs, and strong placement network across IT, core engineering, and management sectors.",
    placements: {
      averageSalary: 900000,
      highestSalary: 8000000,
      placementRate: 88,
      topRecruiters: ["Amazon", "Infosys", "Cognizant", "Tech Mahindra", "Zoho"],
    },
    established: 1985,
    website: "https://www.srmist.edu.in",
    accreditation: "NAAC A++",
    type: CollegeType.DEEMED,
    image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800",
    courses: [
      { name: "Computer Science Engineering", duration: "4 Years", fees: 380000, seats: 600, degree: "B.Tech" },
      { name: "Civil Engineering", duration: "4 Years", fees: 360000, seats: 200, degree: "B.Tech" },
      { name: "MBA", duration: "2 Years", fees: 450000, seats: 200, degree: "MBA" },
    ],
  },
  {
    name: "Amity University",
    location: "Noida, Uttar Pradesh",
    city: "Noida",
    state: "Uttar Pradesh",
    fees: 400000,
    rating: 4.0,
    description:
      "Amity University is a leading private university with a sprawling campus in Noida. It offers diverse programs across engineering, management, law, and humanities with strong industry tie-ups.",
    placements: {
      averageSalary: 800000,
      highestSalary: 7000000,
      placementRate: 85,
      topRecruiters: ["Deloitte", "EY", "HCL", "Wipro", "KPMG"],
    },
    established: 2005,
    website: "https://www.amity.edu",
    accreditation: "NAAC A+",
    type: CollegeType.PRIVATE,
    image: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=800",
    courses: [
      { name: "Computer Science Engineering", duration: "4 Years", fees: 400000, seats: 300, degree: "B.Tech" },
      { name: "Law", duration: "5 Years", fees: 350000, seats: 150, degree: "B.A. LLB" },
      { name: "MBA", duration: "2 Years", fees: 500000, seats: 250, degree: "MBA" },
    ],
  },
  {
    name: "Jadavpur University",
    location: "Kolkata, West Bengal",
    city: "Kolkata",
    state: "West Bengal",
    fees: 50000,
    rating: 4.5,
    description:
      "Jadavpur University is a public university in Kolkata known for its strong engineering and arts programs. One of India's most academically rigorous universities with exceptional research output.",
    placements: {
      averageSalary: 1200000,
      highestSalary: 14000000,
      placementRate: 93,
      topRecruiters: ["TCS", "HCL", "Infosys", "IBM", "Accenture"],
    },
    established: 1955,
    website: "https://jadavpuruniversity.in",
    accreditation: "NAAC A",
    type: CollegeType.GOVERNMENT,
    image: "https://images.unsplash.com/photo-1526779259212-939e64788e3c?w=800",
    courses: [
      { name: "Computer Science Engineering", duration: "4 Years", fees: 50000, seats: 80, degree: "B.E." },
      { name: "Electrical Engineering", duration: "4 Years", fees: 50000, seats: 60, degree: "B.E." },
      { name: "Fine Arts", duration: "3 Years", fees: 40000, seats: 50, degree: "B.F.A." },
    ],
  },
  {
    name: "PSG College of Technology",
    location: "Coimbatore, Tamil Nadu",
    city: "Coimbatore",
    state: "Tamil Nadu",
    fees: 200000,
    rating: 4.4,
    description:
      "PSG College of Technology is a private autonomous institution in Coimbatore known for its strong industry connections, particularly with the textile and engineering sectors of the region.",
    placements: {
      averageSalary: 1000000,
      highestSalary: 9000000,
      placementRate: 91,
      topRecruiters: ["Zoho", "Cognizant", "Infosys", "LG Soft", "PayPal"],
    },
    established: 1951,
    website: "https://www.psgtech.edu",
    accreditation: "NAAC A++",
    type: CollegeType.PRIVATE,
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
    courses: [
      { name: "Computer Science Engineering", duration: "4 Years", fees: 200000, seats: 180, degree: "B.E." },
      { name: "Electronics Engineering", duration: "4 Years", fees: 200000, seats: 120, degree: "B.E." },
      { name: "Textile Technology", duration: "4 Years", fees: 180000, seats: 60, degree: "B.Tech" },
    ],
  },
  {
    name: "Anna University",
    location: "Chennai, Tamil Nadu",
    city: "Chennai",
    state: "Tamil Nadu",
    fees: 90000,
    rating: 4.3,
    description:
      "Anna University is a technical university in Tamil Nadu. It is the parent university for hundreds of engineering colleges across Tamil Nadu and directly runs the prestigious College of Engineering, Guindy campus.",
    placements: {
      averageSalary: 1100000,
      highestSalary: 11000000,
      placementRate: 90,
      topRecruiters: ["Infosys", "TCS", "Wipro", "HCL", "CTS"],
    },
    established: 1978,
    website: "https://www.annauniv.edu",
    accreditation: "NAAC A++",
    type: CollegeType.GOVERNMENT,
    image: "https://images.unsplash.com/photo-1563632775921-5d6f0bce3da5?w=800",
    courses: [
      { name: "Computer Science Engineering", duration: "4 Years", fees: 90000, seats: 100, degree: "B.E." },
      { name: "Information Technology", duration: "4 Years", fees: 90000, seats: 80, degree: "B.E." },
      { name: "Architecture", duration: "5 Years", fees: 100000, seats: 40, degree: "B.Arch" },
    ],
  },
  {
    name: "Christ University",
    location: "Bengaluru, Karnataka",
    city: "Bengaluru",
    state: "Karnataka",
    fees: 300000,
    rating: 4.2,
    description:
      "Christ University is a deemed university in Bengaluru known for its liberal arts, commerce, and management programs. It offers a holistic education model blending academics with co-curricular excellence.",
    placements: {
      averageSalary: 750000,
      highestSalary: 6000000,
      placementRate: 87,
      topRecruiters: ["Deloitte", "EY", "PwC", "ICICI Bank", "Axis Bank"],
    },
    established: 1969,
    website: "https://christuniversity.in",
    accreditation: "NAAC A++",
    type: CollegeType.DEEMED,
    image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800",
    courses: [
      { name: "B.Com", duration: "3 Years", fees: 250000, seats: 300, degree: "B.Com" },
      { name: "BBA", duration: "3 Years", fees: 280000, seats: 250, degree: "BBA" },
      { name: "MBA", duration: "2 Years", fees: 400000, seats: 180, degree: "MBA" },
      { name: "Psychology", duration: "3 Years", fees: 220000, seats: 100, degree: "B.Sc." },
    ],
  },
  {
    name: "Indian Institute of Technology Kanpur",
    location: "Kanpur, Uttar Pradesh",
    city: "Kanpur",
    state: "Uttar Pradesh",
    fees: 245000,
    rating: 4.8,
    description:
      "IIT Kanpur is a globally recognized technical institution famous for being the birthplace of computer science education in India. It consistently produces top researchers, entrepreneurs, and industry leaders.",
    placements: {
      averageSalary: 2050000,
      highestSalary: 24000000,
      placementRate: 97,
      topRecruiters: ["Google", "DE Shaw", "Tower Research", "Samsung Research", "Nvidia"],
    },
    established: 1959,
    website: "https://www.iitk.ac.in",
    accreditation: "NAAC A++",
    type: CollegeType.GOVERNMENT,
    image: "https://images.unsplash.com/photo-1535982330050-f1c2fb79ff78?w=800",
    courses: [
      { name: "Computer Science Engineering", duration: "4 Years", fees: 245000, seats: 100, degree: "B.Tech" },
      { name: "Physics", duration: "4 Years", fees: 245000, seats: 40, degree: "B.Sc." },
      { name: "Industrial Management", duration: "2 Years", fees: 300000, seats: 50, degree: "MBA" },
    ],
  },
  {
    name: "Thapar Institute of Engineering",
    location: "Patiala, Punjab",
    city: "Patiala",
    state: "Punjab",
    fees: 450000,
    rating: 4.3,
    description:
      "Thapar Institute of Engineering & Technology is a deemed university in Patiala, Punjab. Known for its strong technical education, research programs, and excellent placement record in the IT industry.",
    placements: {
      averageSalary: 1300000,
      highestSalary: 12000000,
      placementRate: 92,
      topRecruiters: ["Microsoft", "Adobe", "Samsung", "Qualcomm", "Cisco"],
    },
    established: 1956,
    website: "https://www.thapar.edu",
    accreditation: "NAAC A",
    type: CollegeType.DEEMED,
    image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800",
    courses: [
      { name: "Computer Science Engineering", duration: "4 Years", fees: 450000, seats: 240, degree: "B.E." },
      { name: "Electronics & Communication", duration: "4 Years", fees: 450000, seats: 120, degree: "B.E." },
      { name: "Chemical Engineering", duration: "4 Years", fees: 430000, seats: 80, degree: "B.E." },
    ],
  },
  {
    name: "RV College of Engineering",
    location: "Bengaluru, Karnataka",
    city: "Bengaluru",
    state: "Karnataka",
    fees: 270000,
    rating: 4.4,
    description:
      "R.V. College of Engineering is a private autonomous engineering college in Bengaluru, affiliated to VTU. Renowned for its strong placements in the IT corridor of Bengaluru and quality of education.",
    placements: {
      averageSalary: 1100000,
      highestSalary: 10000000,
      placementRate: 93,
      topRecruiters: ["Amazon", "Flipkart", "Oracle", "SAP", "Bosch"],
    },
    established: 1963,
    website: "https://www.rvce.edu.in",
    accreditation: "NAAC A+",
    type: CollegeType.PRIVATE,
    image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800",
    courses: [
      { name: "Computer Science Engineering", duration: "4 Years", fees: 270000, seats: 180, degree: "B.E." },
      { name: "Electronics Engineering", duration: "4 Years", fees: 270000, seats: 120, degree: "B.E." },
      { name: "Mechanical Engineering", duration: "4 Years", fees: 250000, seats: 80, degree: "B.E." },
    ],
  },
  {
    name: "Symbiosis Institute of Technology",
    location: "Pune, Maharashtra",
    city: "Pune",
    state: "Maharashtra",
    fees: 500000,
    rating: 4.1,
    description:
      "Symbiosis Institute of Technology is a private engineering college in Pune under Symbiosis International University. Known for its industry-focused curriculum and strong MBA and engineering programs.",
    placements: {
      averageSalary: 1000000,
      highestSalary: 9500000,
      placementRate: 89,
      topRecruiters: ["TCS", "Persistent", "Infosys", "Cognizant", "Kpit Technologies"],
    },
    established: 2008,
    website: "https://www.sitpune.edu.in",
    accreditation: "NAAC A",
    type: CollegeType.PRIVATE,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    courses: [
      { name: "Computer Science Engineering", duration: "4 Years", fees: 500000, seats: 120, degree: "B.Tech" },
      { name: "Information Technology", duration: "4 Years", fees: 480000, seats: 80, degree: "B.Tech" },
      { name: "MBA", duration: "2 Years", fees: 600000, seats: 120, degree: "MBA" },
    ],
  },
  {
    name: "Coimbatore Institute of Technology",
    location: "Coimbatore, Tamil Nadu",
    city: "Coimbatore",
    state: "Tamil Nadu",
    fees: 180000,
    rating: 4.2,
    description:
      "Coimbatore Institute of Technology is an autonomous institution affiliated to Anna University. It has a long history of producing quality engineers who work in both domestic and international companies.",
    placements: {
      averageSalary: 850000,
      highestSalary: 7500000,
      placementRate: 88,
      topRecruiters: ["Infosys", "Wipro", "CTS", "TCS", "Zoho"],
    },
    established: 1956,
    website: "https://www.cit.edu.in",
    accreditation: "NAAC A",
    type: CollegeType.PRIVATE,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
    courses: [
      { name: "Computer Science Engineering", duration: "4 Years", fees: 180000, seats: 120, degree: "B.E." },
      { name: "Mechanical Engineering", duration: "4 Years", fees: 175000, seats: 100, degree: "B.E." },
      { name: "Civil Engineering", duration: "4 Years", fees: 175000, seats: 80, degree: "B.E." },
    ],
  },
  {
    name: "Lovely Professional University",
    location: "Phagwara, Punjab",
    city: "Phagwara",
    state: "Punjab",
    fees: 320000,
    rating: 3.9,
    description:
      "Lovely Professional University is a private university in Punjab with one of the largest student enrollments in India. It offers a wide range of programs and emphasizes employability skills.",
    placements: {
      averageSalary: 700000,
      highestSalary: 6000000,
      placementRate: 84,
      topRecruiters: ["TCS", "Infosys", "Wipro", "Amazon", "Jaro Education"],
    },
    established: 2005,
    website: "https://www.lpu.in",
    accreditation: "NAAC A+",
    type: CollegeType.PRIVATE,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
    courses: [
      { name: "Computer Science Engineering", duration: "4 Years", fees: 320000, seats: 1000, degree: "B.Tech" },
      { name: "Fashion Design", duration: "4 Years", fees: 280000, seats: 100, degree: "B.Des" },
      { name: "MBA", duration: "2 Years", fees: 400000, seats: 300, degree: "MBA" },
    ],
  },
  {
    name: "Delhi Technological University",
    location: "New Delhi, Delhi",
    city: "New Delhi",
    state: "Delhi",
    fees: 140000,
    rating: 4.4,
    description:
      "Delhi Technological University (formerly Delhi College of Engineering) is a public university in Delhi known for producing top engineers in India. Offers excellent exposure to Delhi's corporate hub.",
    placements: {
      averageSalary: 1400000,
      highestSalary: 13000000,
      placementRate: 94,
      topRecruiters: ["Google", "Amazon", "Microsoft", "Samsung", "Qualcomm"],
    },
    established: 1941,
    website: "https://dtu.ac.in",
    accreditation: "NAAC A",
    type: CollegeType.GOVERNMENT,
    image: "https://images.unsplash.com/photo-1617042375876-a13e36732a04?w=800",
    courses: [
      { name: "Computer Science Engineering", duration: "4 Years", fees: 140000, seats: 180, degree: "B.Tech" },
      { name: "Software Engineering", duration: "4 Years", fees: 140000, seats: 60, degree: "B.Tech" },
      { name: "Environmental Engineering", duration: "4 Years", fees: 135000, seats: 40, degree: "B.Tech" },
    ],
  },
  {
    name: "KIIT University",
    location: "Bhubaneswar, Odisha",
    city: "Bhubaneswar",
    state: "Odisha",
    fees: 380000,
    rating: 4.2,
    description:
      "KIIT University is a private university in Bhubaneswar known for its sports culture, large campus, and strong engineering programs. Home to the Kalinga Institute of Industrial Technology with excellent placement rates.",
    placements: {
      averageSalary: 950000,
      highestSalary: 8500000,
      placementRate: 89,
      topRecruiters: ["TCS", "Wipro", "HCL", "Infosys", "Mindtree"],
    },
    established: 1992,
    website: "https://kiit.ac.in",
    accreditation: "NAAC A+",
    type: CollegeType.DEEMED,
    image: "https://images.unsplash.com/photo-1596720426673-e4e14290f0cc?w=800",
    courses: [
      { name: "Computer Science Engineering", duration: "4 Years", fees: 380000, seats: 400, degree: "B.Tech" },
      { name: "Biotechnology", duration: "4 Years", fees: 360000, seats: 80, degree: "B.Tech" },
      { name: "Law", duration: "5 Years", fees: 300000, seats: 120, degree: "B.A. LLB" },
    ],
  },
  {
    name: "Shiv Nadar University",
    location: "Greater Noida, Uttar Pradesh",
    city: "Greater Noida",
    state: "Uttar Pradesh",
    fees: 600000,
    rating: 4.3,
    description:
      "Shiv Nadar University is a private research university funded by the HCL Technologies founder. It offers STEM and liberal arts programs with a strong focus on research and global collaboration.",
    placements: {
      averageSalary: 1200000,
      highestSalary: 13000000,
      placementRate: 91,
      topRecruiters: ["HCL", "Microsoft", "Sapient", "Deloitte", "Goldman Sachs"],
    },
    established: 2011,
    website: "https://snu.edu.in",
    accreditation: "NAAC A",
    type: CollegeType.PRIVATE,
    image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800",
    courses: [
      { name: "Computer Science Engineering", duration: "4 Years", fees: 600000, seats: 200, degree: "B.Tech" },
      { name: "Economics", duration: "3 Years", fees: 500000, seats: 80, degree: "B.Sc." },
      { name: "Design", duration: "4 Years", fees: 550000, seats: 60, degree: "B.Des" },
    ],
  },
  {
    name: "Pune Institute of Computer Technology",
    location: "Pune, Maharashtra",
    city: "Pune",
    state: "Maharashtra",
    fees: 220000,
    rating: 4.3,
    description:
      "PICT is a private autonomous engineering college in Pune with a strong reputation in computer engineering and IT. Known for its coding culture, competitive programming achievements, and excellent placements in Pune's IT sector.",
    placements: {
      averageSalary: 1100000,
      highestSalary: 10000000,
      placementRate: 95,
      topRecruiters: ["Persistent", "Infosys", "Accenture", "Capgemini", "ThoughtWorks"],
    },
    established: 1983,
    website: "https://pict.edu",
    accreditation: "NAAC A",
    type: CollegeType.PRIVATE,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800",
    courses: [
      { name: "Computer Engineering", duration: "4 Years", fees: 220000, seats: 240, degree: "B.E." },
      { name: "Information Technology", duration: "4 Years", fees: 220000, seats: 120, degree: "B.E." },
    ],
  },
  {
    name: "Graphic Era University",
    location: "Dehradun, Uttarakhand",
    city: "Dehradun",
    state: "Uttarakhand",
    fees: 280000,
    rating: 4.0,
    description:
      "Graphic Era University is a private university in Dehradun offering programs in engineering, management, and computing. Set in the scenic foothills of the Himalayas with a growing reputation for IT placements.",
    placements: {
      averageSalary: 700000,
      highestSalary: 6000000,
      placementRate: 83,
      topRecruiters: ["TCS", "Infosys", "Wipro", "Byju's", "HCL"],
    },
    established: 1993,
    website: "https://geu.ac.in",
    accreditation: "NAAC A",
    type: CollegeType.DEEMED,
    image: "https://images.unsplash.com/photo-1580992283625-dac5599ede76?w=800",
    courses: [
      { name: "Computer Science Engineering", duration: "4 Years", fees: 280000, seats: 200, degree: "B.Tech" },
      { name: "Data Science", duration: "4 Years", fees: 290000, seats: 60, degree: "B.Tech" },
      { name: "MBA", duration: "2 Years", fees: 350000, seats: 100, degree: "MBA" },
    ],
  },
  {
    name: "Indian Institute of Management Bangalore",
    location: "Bengaluru, Karnataka",
    city: "Bengaluru",
    state: "Karnataka",
    fees: 2400000,
    rating: 4.9,
    description:
      "IIM Bangalore is one of India's most prestigious management institutes, consistently ranked #1 in management education. It produces world-class business leaders, consultants, and entrepreneurs.",
    placements: {
      averageSalary: 3500000,
      highestSalary: 120000000,
      placementRate: 100,
      topRecruiters: ["McKinsey", "BCG", "Bain", "Google", "Amazon"],
    },
    established: 1973,
    website: "https://www.iimb.ac.in",
    accreditation: "AACSB, EQUIS, AMBA",
    type: CollegeType.GOVERNMENT,
    image: "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=800",
    courses: [
      { name: "PGP (MBA)", duration: "2 Years", fees: 2400000, seats: 400, degree: "MBA" },
      { name: "Executive MBA", duration: "1 Year", fees: 3200000, seats: 100, degree: "EMBA" },
      { name: "Ph.D. Management", duration: "4 Years", fees: 500000, seats: 30, degree: "Ph.D" },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Create a demo user
  const hashedPassword = await bcrypt.hash("demo@123", 12);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@college.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@college.com",
      password: hashedPassword,
    },
  });
  console.log(`✅ Created demo user: ${demoUser.email}`);

  // Seed colleges
  for (const college of colleges) {
    const { courses, ...collegeData } = college;

    const created = await prisma.college.create({
  data: {
    ...collegeData,
    courses: {
      create: courses,
    },
  },
  });

    // Add a sample review from demo user
   await prisma.review.create({
  data: {
    collegeId: created.id,
    userId: demoUser.id,
    rating: college.rating - Math.random() * 0.5,
    title: "Great institution",
    comment: `${college.name} has been an excellent choice for higher education. The faculty is experienced and the campus facilities are top-notch.`,
    pros: "Great placements, quality faculty, good infrastructure",
    cons: "Can be expensive, competitive admission process",
  },
  });

    console.log(`✅ Seeded: ${college.name}`);
  }

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
