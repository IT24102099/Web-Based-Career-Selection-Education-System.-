import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { AlternativePath } from "../models/AlternativePath.js";

dotenv.config();

const SEED = [
  {
    title: "Diploma in Information Technology",
    type: "diploma",
    provider: "NIBM / similar institutes",
    duration: "1 year",
    link: "https://example.com/diploma-it",
    description: "Hands-on IT foundation: programming basics, databases, web fundamentals."
  },
  {
    title: "Certificate in Web Development",
    type: "certificate",
    provider: "Online / local training center",
    duration: "3 months",
    link: "https://example.com/cert-web-dev",
    description: "HTML, CSS, JavaScript fundamentals with mini projects."
  },
  {
    title: "Google IT Support Professional Certificate",
    type: "online-course",
    provider: "Coursera",
    duration: "3–6 months",
    link: "https://example.com/google-it-support",
    description: "Beginner-friendly path into IT support, networking, and troubleshooting."
  },
  {
    title: "Vocational Training: Electrician",
    type: "vocational",
    provider: "Vocational training authority",
    duration: "6–12 months",
    link: "https://example.com/vocational-electrician",
    description: "Practical electrical installation and maintenance skills."
  },
  {
    title: "Diploma in Business Management",
    type: "diploma",
    provider: "Private institute",
    duration: "1 year",
    link: "https://example.com/diploma-business",
    description: "Build core business skills: accounting, marketing, operations, communication."
  },
  {
    title: "Certificate in Graphic Design",
    type: "certificate",
    provider: "Design academy",
    duration: "3–6 months",
    link: "https://example.com/cert-graphic-design",
    description: "Learn design basics, typography, layouts, and portfolio building."
  },
  {
    title: "Introduction to Cybersecurity",
    type: "online-course",
    provider: "Cisco / similar",
    duration: "4–8 weeks",
    link: "https://example.com/intro-cyber",
    description: "Security fundamentals and entry-level awareness for tech pathways."
  },
  {
    title: "Vocational Training: Hospitality & Tourism",
    type: "vocational",
    provider: "Hospitality training center",
    duration: "6 months",
    link: "https://example.com/vocational-hospitality",
    description: "Customer service, hotel operations, and tourism industry basics."
  },
  {
    title: "Diploma in Software Engineering (Foundation)",
    type: "diploma",
    provider: "Private institute",
    duration: "12–18 months",
    link: "https://example.com/diploma-se",
    description: "Programming, OOP, databases, and basic web/app development."
  },
  {
    title: "Certificate in English for Career",
    type: "certificate",
    provider: "Language institute",
    duration: "2–3 months",
    link: "https://example.com/cert-english",
    description: "Improve communication skills for interviews and workplace success."
  },
  {
    title: "Data Analysis with Python (Beginner)",
    type: "online-course",
    provider: "Online learning platform",
    duration: "6–10 weeks",
    link: "https://example.com/data-python",
    description: "Learn Python + data basics: pandas, charts, and simple projects."
  },
  {
    title: "Vocational Training: Automotive Technician",
    type: "vocational",
    provider: "Technical college",
    duration: "1 year",
    link: "https://example.com/vocational-auto",
    description: "Vehicle maintenance, diagnostics, and workshop practical training."
  },
  {
    title: "Certificate in Digital Marketing",
    type: "certificate",
    provider: "Marketing academy",
    duration: "2–3 months",
    link: "https://example.com/cert-digital-marketing",
    description: "Social media, ads, content basics, and campaign measurement."
  },
  {
    title: "UI/UX Design Fundamentals",
    type: "online-course",
    provider: "Online learning platform",
    duration: "4–8 weeks",
    link: "https://example.com/uiux-fundamentals",
    description: "User research basics, wireframes, prototypes, and usability principles."
  },
  {
    title: "Diploma in Accounting",
    type: "diploma",
    provider: "Private institute",
    duration: "1 year",
    link: "https://example.com/diploma-accounting",
    description: "Core accounting skills: bookkeeping, payroll basics, and reporting."
  }
];

async function main() {
  await connectDB();

  const existing = await AlternativePath.countDocuments();
  const force = process.env.SEED_FORCE === "1";
  if (existing > 0 && !force) {
    console.log(`AlternativePath already has ${existing} records. Skipping seed (set SEED_FORCE=1 to re-seed).`);
    await mongoose.disconnect();
    return;
  }

  if (force) {
    await AlternativePath.deleteMany({});
  }

  const inserted = await AlternativePath.insertMany(SEED);
  console.log(`Seeded ${inserted.length} alternative paths.`);
  await mongoose.disconnect();
}

main().catch(async (e) => {
  console.error(e);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});

