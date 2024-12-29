import { ChartPie, CircleCheck, Clock, FileMusic, MessageCircle, UserRoundCheck, Workflow } from "lucide-react";
import BodyText from "../../ui/components/BodyText";
import PageTitle from "../../ui/components/PageTitle";
import SubHeading from "../../ui/components/SubHeading";
import IconListItem from "@/app/ui/components/IconListItem";
import FeaturedText from "@/app/ui/components/FeaturedText";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="md:h-10"></div>
      <PageTitle>About</PageTitle>
      <FeaturedText>
    At <strong className="text-txtprimary">Practice Log</strong>, we believe that music practice isn&apos;t just about repetition—it&apos;s about growth, purpose, and connection. Our mission is to transform the way music instructors and students work together, helping them stay organized, track progress, and celebrate achievements, one practice session at a time.
  </FeaturedText>

  <SubHeading>For Instructors</SubHeading>
  <BodyText className="text-xl">
  Teaching music is more than just sharing knowledge—it&apos;s about creating a lasting impact on your students&apos; lives. At Practice Log, we understand the challenges of juggling multiple students while staying organized and engaged. That&apos;s why we&apos;ve built tools to simplify your workflow and help you focus on what matters most: inspiring your students.
  </BodyText>
  <IconListItem icon={<Workflow size={40}/>}>
    <strong >Simplify Your Workflow:</strong> Manage resources like videos, audio recordings, and PDFs in a single, organized platform.
  </IconListItem>
  <IconListItem icon={<ChartPie size={40}/>}>
    <strong >Track Progress:</strong> Set clear goals for your students and monitor their achievements between lessons.
  </IconListItem>
  <IconListItem icon={<MessageCircle size={40}/>}>
    <strong >Engage with Students Anytime:</strong> Answer student questions and provide guidance between lessons with our built-in messaging platform.
  </IconListItem>

  <IconListItem icon={<UserRoundCheck size={40}/>}>
    <strong >Streamlined Access:</strong> Securely log in with your email to get started effortlessly.
  </IconListItem>
  
  <SubHeading>For Students</SubHeading>
  <BodyText className="text-xl">
  Music students need more than just instruction—they need support, structure, and encouragement to thrive. Practice Log gives students a personalized space to take ownership of their practice journey, helping them stay motivated and connected with their teacher every step of the way.
  </BodyText>
  <IconListItem icon={<Clock size={40}/>}>
    Log practice sessions and reflect on their progress.
  </IconListItem>
  <IconListItem icon={<CircleCheck size={40}/>}>
    Stay motivated with clear, instructor-set goals.
  </IconListItem>
  <IconListItem icon={<FileMusic size={40}/>}>
    Access resources anytime, anywhere, through a QR code provided by their teacher.
  </IconListItem>
  <IconListItem icon={<MessageCircle size={40}/>}>
    Stay Connected: Ask questions and receive feedback through our integrated messaging system.
  </IconListItem>

  <SubHeading>Why Practice Log?</SubHeading>
  <BodyText className="text-xl">
    We&apos;re more than just a web app—we&apos;re a community dedicated to fostering musical growth. By bridging the gap between lessons and practice, we empower students and teachers to work together toward meaningful progress.
  </BodyText>
  <BodyText className="text-xl">
    Whether you&apos;re teaching private lessons or managing a studio, Practice Log gives you the tools to create lasting connections and inspire success.
  </BodyText>
  
  <h3 className="text-2xl text-txtprimary font-bold text-center mt-8">Ready to make practice purposeful? </h3>
    <p className="w-full block text-center text-xl text-txtprimary">
      <Link href="/signup" className="text-lighter underline">Sign Up Now</Link> and see how Practice Log can transform the way you teach and inspire.
    </p>
    </>
  );
}
