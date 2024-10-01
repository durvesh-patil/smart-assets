// pages/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const IndexPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.push('/auth'); // Redirect to the auth page
    }, [router]);

    return null; // Render nothing since we are redirecting
};

export default IndexPage;
