import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

type Props = {
    name?: string;
    items?: string[];
    handleSearch: (value: string) => void;
    value: string;
    setValue: (value: string) => void;
};

export const Autocomplete: React.FC<Props> = ({
    name = "",
    items = [],
    handleSearch,
    value,
    setValue,
}: Props) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e: any) => {
            if (e.target.id !== "autocomplete") {
                setOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleChange = (newValue: string) => {
        if (!open) {
            setOpen(true);
        }

        handleSearch(newValue);
        setValue(newValue);
    };

    const handleSelect = (selectedValue: string) => {
        setValue(selectedValue);
        setOpen(false);
    };

    const containerClass = "relative";
    const dropdownClass = "border p-2 absolute w-full mt-2 backdrop-blur-sm text-zinc-300 rounded-md flex flex-col gap-2";

    return (
        <div className={containerClass}>
            <Input
                value={value}
                onFocus={() => setOpen(true)}
                onChange={(e) => handleChange(e.target.value)}
                id="autocomplete"
                name={name}
            />

            {open && items && items.length > 0 && (
                <div className={dropdownClass}>
                    {items.map((item) => (
                        <Button
                            key={`autocomplete_item_${item}`}
                            onClick={() => handleSelect(item)}
                            className="justify-start"
                            variant="ghost"
                        >
                            {item}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
};