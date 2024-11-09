import BodyText from "./ui/components/BodyText";
import FeaturedText from "./ui/components/FeaturedText";
import HoverLink from "./ui/components/HoverLink";
import PageTitle from "./ui/components/PageTitle";
import SubHeading from "./ui/components/SubHeading";

export default function Home() {
  return (
    <>
      <main className="w-full min-h-full flex flex-col justify-center items-center gap-4 px-8 pt-[85px] pb-8 md:px-20">
        <PageTitle>Practice Log</PageTitle>
        <section className="my-6 text-center grid gap-4">
          <FeaturedText>Get Started!</FeaturedText>
          <div className="flex gap-6">
            <HoverLink
              href="/login"
              className="w-40 border-2 rounded border-slate-800"
            >
              Login
            </HoverLink>
            <HoverLink
              href="/about"
              className="w-40 border-2 rounded border-slate-800"
            >
              Learn More
            </HoverLink>
          </div>
        </section>
        <SubHeading>Why Practice Log?</SubHeading>
        <BodyText>
          Practice Log connects music instructors and students, providing tools
          for logging practice, sharing resources, and setting goals. With
          instructor and student portals, it&apos;s designed to make music
          learning and practice more effective and enjoyable.
        </BodyText>
      </main>
    </>
  );
}
