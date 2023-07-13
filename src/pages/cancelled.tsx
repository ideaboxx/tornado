import {
	Button,
	Heading,
	useBoolean,
	useBreakpointValue,
	useInterval,
	VStack
} from '@chakra-ui/react';
import Empty from '@components/Empty';
import axios from 'axios';
import Layout from 'layouts';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Cancelled() {
	const [torrents, setTorrents] = useState([]);
	const breakpt = useBreakpointValue({ base: 'base', md: 'md' });
	const [flag, setFlag] = useBoolean(true);
	const router = useRouter();

	useInterval(() => {
		axios
			.get('/api/listCancelled')
			.then(({ data }) => {
				setTorrents(data.list);
			})
			.catch((e) => {
				console.error(e);
				router.replace('/');
			})
			.finally(() => setFlag.off());
	}, 1000);

	return (
		<Layout>
			<div className={`${breakpt == 'md' ? 'p-7' : 'p-4'} overflow-y-auto`}>
				<Heading size={'md'} className='mb-4'>
					Cancelled
				</Heading>
				<VStack align='stretch'>
					{torrents?.map((t) => (
						<Item {...t} key={t.info_hash} />
					))}
					{torrents.length == 0 && (
						<Empty showSpinner={flag} placeholder='No items to display' />
					)}
				</VStack>
			</div>
		</Layout>
	);
}

interface propType {
	torrent_name: string;
	info_hash: string;
	id: string;
	magnet: string;
}

function Item(props: propType) {
	const copyToClipboard = (text) => {
		var dummy = document.createElement('textarea');
		// dummy.style.display = 'none'
		document.body.appendChild(dummy);
		dummy.value = text;
		dummy.select();
		document.execCommand('copy');
		document.body.removeChild(dummy);
	};

	const del = () => {
		axios.post('/api/deleteLog', { id: props.id });
	};

	return (
		<div className='p-4 my-2 bg-gray-800 rounded-md'>
			<div className='font-semibold my-2'>{props.torrent_name}</div>
			<div className='text-gray-400 text-sm my-2'>Info Hash: {props.info_hash}</div>
			<div className='mt-3 space-x-2'>
				<Button size={'sm'} onClick={() => copyToClipboard(props.magnet)}>
					Copy Magnet
				</Button>
				<Button size={'sm'} colorScheme='red' variant={'ghost'} onClick={del}>
					Delete
				</Button>
			</div>
		</div>
	);
}
