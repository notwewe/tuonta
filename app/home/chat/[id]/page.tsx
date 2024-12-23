"use client"
import useSWR from 'swr'
import { faCircleXmark,faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from 'next/navigation'

import Link from "next/link";

type ProfileProps = {
    username: string;
    email: string;
    birthday: string;
    gender: string;
    bio: string;
    school: string;
    course: string;
    distance: number;
    hobbies: string[];
  };    

type ChatProps = {
    id: number;
    user1Id: number;
    user2Id: number;
    createdAt: string;
    chatItems: ChatItemProps[];
};

type ChatItemProps = {
    chatId: number;
    senderId: number;
    message: string;
    timestamp: string;
};

const fetcher = (e : string) => fetch(e).then(res => res.json())

function getProfile(id: any){
    const { data, error } = useSWR(`https://localhost:7113/api/profiles/${id}`, fetcher);
    return {
      data: data ? data : '',
      loading: !data && !error,
      error
    };
};

function getChat(id: any){
    const { data, error } = useSWR(`https://localhost:7113/api/chats/${id}`, fetcher);
    return {
      data: data ? data : '',
      loading: !data && !error,
      error
    };
}


function getChatProfile(id: any){
    var {data, loading, error } = getChat(id)

    // console.log(data)

    var {data, loading, error } = getProfile(data.user2Id)


    return {
      data: data ? data : '',
      loading: !data && !error,
      error
    };
};



export const ProfileTagItem = ({children} : any) => {
    const colors = ["bg-red-300", "bg-blue-300", "bg-green-300", "bg-yellow-300", "bg-purple-300", "bg-pink-300", "bg-indigo-300", "bg-gray-300"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    return (
        <span className={`text-xs ${randomColor} rounded-full font-bold p-2`}>{children}</span>
    );
}

export const ProfileTags = (data : any) => {
    const tags: string[] = data.tags

    if (!tags) {
        return null; // or you can return a fallback UI
    }

    return (
        <div className = "flex flex-col gap-2">
            <div className = "flex gap-2">

                 {tags.map((hobby : string, index : number) => (
                <ProfileTagItem key={index}>{hobby}</ProfileTagItem>
                ))}
            </div>
        </div>
    )
}

export const ProfileOverview = () => {
    const userData = getChatProfile(useParams().id).data

    // console.log(userData)

    return (
        <div className = "w-1/2 h-full p-2 flex flex-col gap-4 border-l-2">
            <div className = "w-full h-1/2 bg-gray-300 rounded-lg"></div>
            <div className = "flex flex-col gap-1">
                <span className = "text-2xl font-bold">{userData.username}</span>
                <span className = "text-md">{userData.school}</span>
                <span className = "text-xs text-gray-500">{userData.course}</span>

            </div>

            <ProfileTags tags={userData.hobbies}></ProfileTags>

            <div className = "flex-wrap break-all">
                <span className = "text-gray-500 text-sm font-light ">{userData.bio}</span>
            </div>


        </div>
    )
}

export const LeftChat = ({children} : any) => {
    return ( <div className="w-full h-12">
        <div className = "flex p-4 items-center w-fit h-9 bg-[#F2DFFD] rounded-full">{children}</div>
    </div>)

}

export const RightChat = ({children} : any) => {
    return ( <div className="w-full h-12 flex justify-end">
        <div className = "flex p-4 items-center w-fit h-9 bg-[#C8B6FF] rounded-full">{children}</div>
    </div>)

}

export const ChatArea = () => {
    const { data, loading, error } = getChat(useParams().id);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const userId = data.user1Id;
    const senderId = data.user2Id;

    console.log(data)

    return (
        <div className="flex flex-col flex-grow gap-4 p-4 h-1 w-full overflow-y-auto">
            {data.chatItems.map((message: any, index: number) => (
                message.senderId === senderId ? (
                    <LeftChat key={index}>{message.message}</LeftChat>
                ) : (
                    <RightChat key={index}>{message.message}</RightChat>
                )
            ))}
        </div>
    );
};


export default function ChatPage() {
    const {data, loading, error } = getChatProfile(useParams().id)

    return (
        <div className = "flex w-full h-full max-h-full">
            {/* Chat Page */}
            <div className = "flex flex-col w-full h-full max-h-full">
                <div className = "p-4 flex items-center w-full justify-between h-24 border-b-2">
                    <span>{data.username}</span>
                    <Link href="/home"><FontAwesomeIcon icon={faCircleXmark} /></Link>
                </div>

                <ChatArea/>

                <div className = "p-2 flex gap-2 items-center justify-between h-12 bg-[#4530A7]">
                    <input type="text" placeholder="Type a message" className = "flex-grow h-full bg-white text-[#1A1A1A] rounded-full p-2"/>
                    <FontAwesomeIcon className="text-white" icon={faPaperPlane} />
                </div>
            </div>

            

            {/* Profile Overview */}
            <ProfileOverview></ProfileOverview>
        </div>
    )
}