import BodyText from "./ui/components/BodyText";
import HomeLinks from "./ui/components/HomeLinks";
import PageTitle from "./ui/components/PageTitle";
import SubHeading from "./ui/components/SubHeading";


export default function Home() {
  return (
    <>
      <main className="w-full min-h-full flex flex-col justify-center items-center gap-4 px-8 pt-[85px] pb-8 md:px-20">
        <PageTitle>Practice Log</PageTitle>
        <HomeLinks />
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
