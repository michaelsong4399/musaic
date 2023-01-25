import { useRouter } from "next/router";

export default function Home() {
    const router = useRouter();
    return (
        <>
            <div
                onClick={() => {
                    router.push("/test");
                }}>
                Host
            </div>
        </>
    );
}
