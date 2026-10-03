import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import { cn } from "@/lib/utils";
import { getSubjectColor } from "@/constants";
import Link from "next/link";
import Image from "next/image";

interface CompanionListProps {
    title: string;
    companions?: Companion[];
    classNames?: string;
}
const CompanionsList = ({title, companions, classNames}: CompanionListProps) => {
  return (
        <article className={cn('companion-list', classNames)}>
                <h2>{title}</h2>
        <Table>
            <TableCaption>List of recent companions</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className='text-lg w-2/3'>Name</TableHead>
                    <TableHead className='text-lg'>Subject</TableHead>
                    <TableHead className='text-lg'>Duration</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {companions?.map((companion) => (
                    <TableRow key={companion.id}>
                        <TableCell className='text-lg'>
                            <Link href={`/companions/${companion.id}`} className='block text-blue-500 hover:underline'>
                                <div className="flex items-center justify-start gap-2">
                                    <div className='size-10 flex items-center justify-center rounded-lg max-md:hidden bg-gray-200' style={{backgroundColor: getSubjectColor(companion.subject)}}>
                                        <Image src={`icons/${companion.subject}.svg`} alt={companion.subject} width={24} height={24} />
                                    </div>
                                    <span>{companion.name}</span>
                                </div>
                            </Link>
                        </TableCell>
                        <TableCell className='text-lg'>{companion.subject}</TableCell>
                        <TableCell className='text-lg'>{companion.duration}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </article>
  )
}

export default CompanionsList