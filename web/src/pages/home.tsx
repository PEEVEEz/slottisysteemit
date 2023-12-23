import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ChevronLeft, ChevronRight, LinkIcon, TwitchIcon } from "lucide-react";

export function HomePage() {
    const fixTextLength = (message: string) => {
        return message.slice(1, 199) + "..."
    }

    return <div className="flex pt-16 lg:pt-32 flex-col lg:flex-row items-center lg:items-start mx-auto max-w-7xl text-neutral-200 lg:justify-between px-3 xl:px-0">
        <div className="max-w-xl space-y-8">
            <div>
                <h1 className="text-5xl font-semibold text-center lg:text-start">Effortless Bonus Organization & Tracking</h1>
                <div className="text-sm text-zinc-500 mt-3 text-center lg:text-start">
                    Unlock the power of BonusHunt Tracker – your go-to solution for easy bonus organization and tracking. Enjoy the freedom of seamless integration and customization, showcasing your epic wins on streams. Best of all, it's not just free; it's fully open source! Take control of your bonuses without any cost, contribute to the community, and elevate your gaming journey to new heights!
                </div>
            </div>

            <div className="flex justify-center lg:justify-start">
                <Button variant={"secondary"} asChild className="flex items-center gap-2" size={"lg"}>
                    <Link to={"http://localhost:3001/auth/login"}>
                        <TwitchIcon className="w-5 h-5 select" />
                        <span>Login for free</span>
                    </Link>
                </Button>
            </div>
        </div>

        <div className="py-6 lg:py-0">
            <div className="w-96 rounded relative" style={{
                backgroundSize: "40px 60px",
                backgroundImage: "radial-gradient(circle,#ffffff20 1px, rgba(255, 255, 255, 0) 1px)"
            }}>
                <button className="absolute left-0 top-1/3 -translate-y-1/2">
                    <ChevronLeft />
                </button>

                <div className="w-full h-full flex flex-col items-center px-10 py-9">
                    <img className="w-20 h-20 rounded-full" src="https://i.seadn.io/gae/2HpFlXRKpJZl3uS3BaEiWbV1wr1T43uf32_iQbzVnZBLvu13Nl3NxjgPFy-d_gdKPUpCpk_H2E98EWrmRFusQ99p2s4zaEL1m3NN?auto=format&dpr=1&w=1000" />

                    <h1 className="text-lg mt-1">Juzbe</h1>

                    <span className="text-center">
                        {fixTextLength("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis arcu purus, et rutrum erat vulputate quis. Aliquam erat volutpat. Ut iaculis ultricies enim, vel lobortis arcu blandit id. Aliquam erat volutpat. Sed sem lorem, venenatis eu nunc at, malesuada vestibulum lectus. Morbi mattis condimentum felis, sed pharetra nibh ultricies tincidunt. Nunc volutpat enim risus, pretium euismod elit bibendum scelerisque. Morbi id finibus nisi. Sed molestie eros non vestibulum dapibus. ")}
                    </span>

                    <div className="flex mt-2">
                        <Button size={"sm"} variant={"ghost"}>
                            <TwitchIcon className="w-5 h-5" />
                        </Button>

                        <Button size={"sm"} variant={"ghost"}>
                            <LinkIcon className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                <button className="absolute right-0 top-1/3 -translate-y-1/2">
                    <ChevronRight />
                </button>
            </div>
        </div>

    </div >
}