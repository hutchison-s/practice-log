export default function PageTitle({
    children,
  }: Readonly<{
    children: string;
  }>) {
    
    const words = children.split(' ')
    const isMultiline = words.length > 1;
    return (
            children && isMultiline && !/sign/gi.test(children)
              ? <h2 className="grid gap-0 w-full text-center text-shadow-xl mb-6 mt-2">
                  <span className="font-golos font-bold text-[2.75rem] text-white md:text-[6rem] uppercase -mb-4 md:-mb-8">{words[0]}</span>
                  <span className="font-inter font-light text-teal-600 text-[2.25rem] md:text-[5rem]">{words.slice(1).join(' ')}</span>
                </h2>
              :
            <h2 className="my-6 leading-none w-full text-[2.75rem] text-center font-inter font-black md:text-[6rem] text-shadow-xl uppercase">
              {children}
            </h2>
    )
  }