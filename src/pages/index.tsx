import { Box, Center, Container, Spinner, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
export default function Index() {
	const [isLoading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		axios
			.get('/api/getLoggedInUser')
			.then(() => router.replace('/dashboard'))
			.catch(() => router.replace('/loginSignup'))
			.finally(() => setLoading(false));
	}, [router]);

	return (
		<Container h='100vh'>
			<Center h='100vh'>
				<Box
					rounded='md'
					p='6'
					w='full'
					maxW='25em'
					bg={'gray.700'}
					className='shadow-2xl text-center'
				>
					<Text my='4'>Checking login status..</Text>
					<Spinner />
				</Box>
			</Center>
		</Container>
	);
}
