import {
  Check,
  CircleCheck,
  FileMusic,
  MessageCircle,
  NotebookPen,
  Wrench,
} from "lucide-react";
import BodyText from "./ui/components/BodyText";
import GlassDiv from "./ui/components/GlassDiv";
import Hero from "./ui/components/Hero";
import HomeLinks from "./ui/components/HomeLinks";
import SubHeading from "./ui/components/SubHeading";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="w-full max-w-[1000px] mx-auto flex flex-col justify-center items-center gap-4 pb-8">
        <Hero />
        <HomeLinks />
        <section className="w-full grid gap-12 my-12 lg:grid-cols-2">
          <GlassDiv>
            <SubHeading className="text-center">Why Practice HQ?</SubHeading>
            <BodyText className="my-4">
              Practice HQ is built for music teachers who want to inspire their
              students while staying organized. By bridging the gap between
              lessons and practice, we make it easier to share resources, set
              goals, and track progress—all in one intuitive platform.
            </BodyText>
            <ul className="flex flex-col gap-4 mt-4">
              <li className="flex items-start gap-2">
                <Check aria-label="Check Mark"className="text-teal-600" strokeWidth={4} />
                <BodyText>
                  <strong className="text-txtprimary font-bold">
                    Save Time:
                  </strong>{" "}
                  Streamline lesson planning and student communication.
                </BodyText>
              </li>
              <li className="flex items-start gap-2">
                <Check aria-label="Check Mark"className="text-teal-600" strokeWidth={4} />
                <BodyText>
                  <strong className="text-txtprimary font-bold">
                    Stay Connected:
                  </strong>{" "}
                  Share resources and respond to questions between lessons.
                </BodyText>
              </li>
              <li className="flex items-start gap-2">
                <Check aria-label="Check Mark"className="text-teal-600" strokeWidth={4} />
                <BodyText>
                  <strong className="text-txtprimary font-bold">
                    Measure Growth:
                  </strong>{" "}
                  Track student practice and goal completion effortlessly.
                </BodyText>
              </li>
            </ul>
          </GlassDiv>
          <GlassDiv>
            <SubHeading className="text-center">
              Everything You Need in One Place
            </SubHeading>
            <ul className="flex flex-col gap-4 mt-4">
              <li>
                <h4 className="font-bold font-golos text-xl text-teal-500 py-1">
                  Step 1:{" "}
                  <span className="text-white font-normal">
                    Set Up Your Studio
                  </span>
                </h4>{" "}
                <BodyText>
                  Easily create your profile, set personalized goals, and print
                  student QR codes for login.
                </BodyText>
              </li>
              <li>
                <h4 className="font-bold font-golos text-xl text-teal-500 py-1">
                  Step 2:{" "}
                  <span className="text-white font-normal">
                    Assign Resources
                  </span>
                </h4>{" "}
                <BodyText>
                  Upload sheet music, videos, and PDFs to keep everything
                  accessible.
                </BodyText>
              </li>
              <li>
                <h4 className="font-bold font-golos text-xl text-teal-500 py-1">
                  Step 3:{" "}
                  <span className="text-white font-normal">
                    Track and Communicate
                  </span>
                </h4>{" "}
                <BodyText>
                  Monitor practice logs, review goals, and answer student
                  questions with built-in messaging.
                </BodyText>
              </li>
            </ul>
          </GlassDiv>
          <GlassDiv className="lg:col-span-2">
            <SubHeading className="text-center">
              Features at a Glance
            </SubHeading>
            <ul className="flex flex-col gap-4 mt-4">
              <li className="mx-auto flex justify-center gap-4 items-center md:w-3/4">
                <CircleCheck aria-label="Check Mark" className="text-teal-500" size={60} />
                <BodyText>
                  <strong className="font-bold text-txtprimary">
                    Goal Setting:
                  </strong>{" "}
                  Assign and track practice goals easily.
                </BodyText>
              </li>
              <li className="mx-auto flex justify-center gap-4 items-center md:w-3/4">
                <FileMusic aria-label="Media File" className="text-teal-500 block" size={60} />
                <BodyText>
                  <strong className="font-bold text-txtprimary">
                    Resource Sharing:
                  </strong>{" "}
                  Upload videos, PDFs, and sheet music directly.
                </BodyText>
              </li>
              <li className="mx-auto flex justify-center gap-4 items-center md:w-3/4">
                <NotebookPen aria-label="Notepad" className="text-teal-500 block" size={60} />
                <BodyText>
                  <strong className="font-bold text-txtprimary">
                    Practice Logs:
                  </strong>{" "}
                  Empower students to stay accountable with detailed logs.
                </BodyText>
              </li>
              <li className="mx-auto flex justify-center gap-4 items-center md:w-3/4">
                <MessageCircle aria-label="Messaging" className="text-teal-500 block" size={60} />
                <BodyText>
                  <strong className="font-bold text-txtprimary">
                    Messaging Platform:
                  </strong>{" "}
                  Stay connected between lessons with quick, in-app
                  communication.
                </BodyText>
              </li>
              <li className="mx-auto flex justify-center gap-4 items-center md:w-3/4">
                <Wrench aria-label="Tools" className="text-teal-500 block" size={60} />
                <BodyText>
                  <strong className="font-bold text-txtprimary">
                    Built-In Tools:
                  </strong>{" "}
                  Full-featured{" "}
                  <Link href={"/metronome"} className="text-lighter underline">
                    metronome
                  </Link>{" "}
                  and{" "}
                  <Link href={"/tuner"} className="text-lighter underline">
                    tuner
                  </Link>{" "}
                  tools built-in for quick access during practice sessions.
                </BodyText>
              </li>
            </ul>
          </GlassDiv>
          <div className="grid place-items-center lg:col-span-2">
            <HomeLinks />
          </div>
        </section>
      </main>
    </>
  );
}
