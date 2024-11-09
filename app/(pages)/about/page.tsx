import BodyText from "../../ui/components/BodyText";
import PageTitle from "../../ui/components/PageTitle";
import SubHeading from "../../ui/components/SubHeading";

export default function Page() {
  return (
    <>
      <PageTitle>About</PageTitle>
      <BodyText>
        At Practice Log, we&apos;re passionate about making music practice
        purposeful, accessible, and engaging. Our web app connects music
        students and instructors, helping them stay organized, track progress,
        and reach musical goals together.
      </BodyText>

      <SubHeading>For Instructors</SubHeading>
      <BodyText>
        Practice Log simplifies the way music instructors support their students
        outside the lesson room. With a seamless Google login, instructors can
        easily share resources like videos, audio recordings, and PDFs, all in
        one place. This makes it easier than ever to keep students engaged and
        progressing toward their goals.
      </BodyText>

      <SubHeading>For Students</SubHeading>
      <BodyText>
        Practice Log offers students a personalized space to log practice,
        reflect on sessions, and track goals set by their instructor. Accessed
        through a QR code provided by their teacher, Practice Log is their
        gateway to a structured and inspiring practice routine.
      </BodyText>

      <SubHeading>Our Mission</SubHeading>
      <BodyText>
        We believe in empowering students to make every practice session a step
        forward in their musical journey. Practice Log is more than an app; it&apos;s
        a tool for growth, connection, and inspiration, designed to support
        musicians every step of the way.
      </BodyText>
    </>
  );
}
