import { useState } from "react";

/**
 * TextClipboard provides a small component
 * to copy text to the clipboard when the copy
 * icon is clicked or tapped.  For text strings
 * that are wider than 20 characters, it elides
 * displayed text.
 * @param text the text to copy to the clipboard
 * @returns the TextClipboard component
 */
export default function TextClipboard({ text }: { text: string }) {

    const [state, setState] = useState(text);

    let elidedText: string = "";
    if (text.length > 20) {
        const prefix = text.substring(0, 10);
        const suffix = text.substring(text.length - 10, text.length);
        elidedText = prefix + "..." + suffix;
    } else {
        elidedText = text;
    }
    return (
        <div id={text}
            className="flex flex-row items-center justify-center">
            <p className="text-slate-700 px-3 py-5">{elidedText}</p>
            <button className="relative flex flex-col items-center justify-center
                cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg"
                    onClick={(event) => {
                        event.preventDefault();
                        navigator.clipboard.writeText(state).then(() => {
                            console.log(event);
                            let parent = event.target.parentElement.parentElement;
                            parent?.lastElementChild?.classList.remove("hidden");
                            setTimeout(() => {
                                parent?.lastElementChild?.classList.add("hidden");
                            }, 2000)
                        }
                        );
                    }}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 text-indigo-950 hover:text-sky-500">
                    <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" />
                    <path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" />
                </svg>
                <p className="hidden absolute -right-8 w-fit 
                text-center text-indigo-50 rounded-sm px-2 py-1
                bg-indigo-950">
                    Copied!
                </p>
            </button>
        </div>
    )
}