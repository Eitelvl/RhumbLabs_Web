import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import * as fs from "fs";
import * as path from "path";

// Define text contents to extract and format neatly in a Word Document
const doc = new Document({
  sections: [
    {
      properties: {},
      children: [
        // Document Header
        new Paragraph({
          text: "RHUMB LABS - WEB TEXT CATALOG",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          text: "Marketing content and descriptive copy from all public pages, organized by section.",
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
        }),
        new Paragraph({
          text: "Note: This document contains all user-facing marketing copy and excludes legal, privacy policies, terms of use, or general legal disclaimers as requested.",
          alignment: AlignmentType.CENTER,
          spacing: { after: 480 },
        }),

        // --- SECTION 1: LANDING PAGE ---
        new Paragraph({
          text: "1. LANDING PAGE (HOME)",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({ text: "Top Banner Badge: ", bold: true }),
            new TextRun({ text: "Building the next generation of software at RhumbLabs" }),
          ],
          spacing: { after: 120 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Main Headline: ", bold: true }),
            new TextRun({ text: "RhumbLabs digital products." }),
          ],
          spacing: { after: 120 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Key Subtitle: ", bold: true }),
            new TextRun({ text: "We focus on creating reliable, intuitive, and beautifully crafted software." }),
          ],
          spacing: { after: 240 },
        }),

        new Paragraph({
          text: "Products Featured on the Home Page:",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 120, after: 120 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({ text: "- Product 1: RhumbNav", bold: true }),
          ],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "  • Tagline: ", bold: true }),
            new TextRun({ text: "Aviation precision in your pocket." }),
          ],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "  • Description: ", bold: true }),
            new TextRun({ text: "The all-in-one flight planning, navigation, and logbook platform designed exclusively for modern pilots. Beautifully complex, incredibly simple to use." }),
          ],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "  • Core Features Listed: ", bold: true }),
            new TextRun({ text: "Complete VFR Navigation, Digital Logbook & Pilot Credentials, Real-time Weather & Airport Info, Advanced E6B Flight Computer." }),
          ],
          spacing: { after: 180 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "- Product 2: Pogo", bold: true }),
          ],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "  • Tagline: ", bold: true }),
            new TextRun({ text: "Climb higher, track smarter." }),
          ],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "  • Description: ", bold: true }),
            new TextRun({ text: "Log your bouldering sessions, visualize your progress over time, and stay motivated. Built specifically for the climbing community." }),
          ],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "  • Core Features Listed: ", bold: true }),
            new TextRun({ text: "Track Grades, Performance Analytics, Unlock Achievements, Session Logging." }),
          ],
          spacing: { after: 240 },
        }),

        new Paragraph({
          text: "Manifesto / About Section:",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 120, after: 120 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Headline: ", bold: true }),
            new TextRun({ text: "Crafting Software with intention." }),
          ],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Description: ", bold: true }),
            new TextRun({ text: "We care deeply about clarity, functionality, and creating tools that feel intuitive from the very first tap. By bringing together design and robust engineering, we shape digital products that are simple, reliable, and built with purpose." }),
          ],
          spacing: { after: 480 },
        }),

        // --- SECTION 2: RHUMBNAV ---
        new Paragraph({
          text: "2. RHUMBNAV PRODUCT PAGE",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Main Slogan: ", bold: true }),
            new TextRun({ text: "Flight simplified. Navigation perfected." }),
          ],
          spacing: { after: 120 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Overview Copy: ", bold: true }),
            new TextRun({ text: "RhumbNav is a new light EFB shaped by real flight experience, bringing flight planning, navigation, and in-flight awareness into one seamless experience." }),
          ],
          spacing: { after: 120 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Availability Status: ", bold: true }),
            new TextRun({ text: "Coming Soon for Android" }),
          ],
          spacing: { after: 240 },
        }),

        new Paragraph({
          text: "Detailed Product Features:",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 120, after: 120 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Flight Calculations (E6B Computer): ", bold: true }),
            new TextRun({ text: "Flight calculations made faster, cleaner, and easier. From wind correction to fuel planning, RhumbNav gives you the numbers that matter—without the clutter." }),
          ],
          spacing: { after: 120 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Pilots Log Tracker: ", bold: true }),
            new TextRun({ text: "A better logbook - A smarter way to track your flying life. Keep flight time, landings, approaches, and records organized in a logbook built for modern aviation." }),
          ],
          spacing: { after: 120 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Pilot Credentials & Licensing: ", bold: true }),
            new TextRun({ text: "Licenses and certificates, simplified - Carry your pilot licenses, medical certificates, and official documents directly on your device. Easily track expiration dates and always stay compliant, wherever you fly." }),
          ],
          spacing: { after: 120 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• VFR Navigation Confidence: ", bold: true }),
            new TextRun({ text: "Built for confident flying - Purpose-built VFR navigation for pilots who value clarity in the cockpit. Plan smarter, stay oriented, and fly with greater confidence. All your credentials and documents seamlessly integrated." }),
          ],
          spacing: { after: 240 },
        }),

        new Paragraph({
          text: "Bottom Callout Section:",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 120, after: 120 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Slogan: ", bold: true }),
            new TextRun({ text: "Aviation in your pocket." }),
          ],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Summary Call: ", bold: true }),
            new TextRun({ text: "Experience modern flying without the clutter. Start navigating, planning, and logging with unprecedented clarity." }),
          ],
          spacing: { after: 480 },
        }),

        // --- SECTION 3: POGO ---
        new Paragraph({
          text: "3. POGO PRODUCT PAGE",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Main Slogan: ", bold: true }),
            new TextRun({ text: "Master every route. Elevate your climb." }),
          ],
          spacing: { after: 120 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Overview Copy: ", bold: true }),
            new TextRun({ text: "Designed exclusively for the climbing community. Log your sessions, analyze your progress, and stay motivated with a digital companion built for the wall." }),
          ],
          spacing: { after: 120 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Availability Status: ", bold: true }),
            new TextRun({ text: "Coming Soon for Android" }),
          ],
          spacing: { after: 240 },
        }),

        new Paragraph({
          text: "Detailed Product Features:",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 120, after: 120 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Climbing Logger & Notes: ", bold: true }),
            new TextRun({ text: "Log your bouldering sessions, attempts, completed problems, grades, climbing time, and personal notes. Pogo keeps your history organized to make your progression tangible." }),
          ],
          spacing: { after: 120 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Progress Visualizer: ", bold: true }),
            new TextRun({ text: "Clear Progression - Turn your data into powerful, visual graphs. Track your activity and improve over time." }),
          ],
          spacing: { after: 120 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Climbing Achievements: ", bold: true }),
            new TextRun({ text: "Unlock Achievements - Push your limits and unlock achievements. Log boulder, route, or mixed sessions with a scale adapted to where you climb." }),
          ],
          spacing: { after: 240 },
        }),

        new Paragraph({
          text: "Bottom Callout Section:",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 120, after: 120 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Slogan: ", bold: true }),
            new TextRun({ text: "A smarter way to climb" }),
          ],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Summary Call: ", bold: true }),
            new TextRun({ text: "From quick session logging to long-term statistics, Pogo offers climbers a personal space to record, analyze, and grow in the world of bouldering." }),
          ],
          spacing: { after: 480 },
        }),

        // --- SECTION 4: CONTACT PAGE ---
        new Paragraph({
          text: "4. CONTACT PAGE",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Badge Label: ", bold: true }),
            new TextRun({ text: "Connect" }),
          ],
          spacing: { after: 120 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Headline: ", bold: true }),
            new TextRun({ text: "Get in touch." }),
          ],
          spacing: { after: 120 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Overview: ", bold: true }),
            new TextRun({ text: "For questions, ideas, feedback, support, or business inquiries, feel free to reach out to the Rhumb Labs team." }),
          ],
          spacing: { after: 240 },
        }),

        new Paragraph({
          text: "Company Core Contact Info:",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 120, after: 120 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• General Support Email: ", bold: true }),
            new TextRun({ text: "support@rhumblabs.com" }),
          ],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Company Location Base: ", bold: true }),
            new TextRun({ text: "Santiago de Chile" }),
          ],
          spacing: { after: 120 },
        }),

        new Paragraph({
          text: "Support Form Details & Scope:",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 120, after: 120 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Card Header: ", bold: true }),
            new TextRun({ text: "Contact Rhumb Labs" }),
          ],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Card Description: ", bold: true }),
            new TextRun({ text: "For support, privacy requests, business inquiries, or app-related questions, you can reach the Rhumb Labs team by email." }),
          ],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Action Specific Mail Options: ", bold: true }),
            new TextRun({ text: "Privacy Request, Business Inquiry, App Support, Delete my Pogo account." }),
          ],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "User Instruction Notice: ", bold: true }),
            new TextRun({ text: "For privacy or data deletion requests, please include the app name and the email associated with your account, if applicable." }),
          ],
          spacing: { after: 240 },
        }),
      ],
    },
  ],
});

// Output path
const outputPath = path.join(process.cwd(), "public", "rhumblabs-texts.docx");

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`Successfully generated word document at: ${outputPath}`);
}).catch((err) => {
  console.error("Error generating word document:", err);
  process.exit(1);
});
