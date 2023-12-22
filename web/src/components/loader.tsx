import { LoaderIcon } from "lucide-react";

export function Loader() {
    return <div className="text-zinc-300">
        <LoaderIcon className="w-14 h-14 animate-spin " />
    </div>
}