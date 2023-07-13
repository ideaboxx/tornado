import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	Input,
	Center,
	ModalFooter,
	useDisclosure,
	useToast
} from '@chakra-ui/react';
import axios from 'axios';
import { useRef } from 'react';
import { VscAdd } from 'react-icons/vsc';
import If from './If';
import Dropzone from 'react-dropzone';

export default function AddTorrent(props) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const input = useRef<HTMLInputElement>();
	const toast = useToast();

	const submit = async () => {
		const magnet = input.current.value;
		if (magnet && magnet.startsWith('magnet')) {
			await axios.post('/api/submitTorrent', { magnet });
		} else {
			toast({
				position: 'top',
				status: 'warning',
				title: 'Invalid input value'
			});
		}
		onClose();
	};

	const onDrop = (files) => {
		const reader = new FileReader();
		reader.addEventListener('load', (event) => {
			let base64 = event.target.result;
			if (typeof base64 == 'string') {
				const torrentFile = base64.replace(
					'data:application/x-bittorrent;base64,',
					''
				);
				axios.post('/api/submitTorrent', { torrentFile });
			}
		});
		reader.readAsDataURL(files[0]);
		onClose();
	};

	return (
		<>
			<If condition={props.size != 'sm'}>
				<Button width={'full'} leftIcon={<VscAdd />} onClick={onOpen}>
					Add Torrent
				</Button>
			</If>
			<If condition={props.size == 'sm'}>
				<Button onClick={onOpen}>
					<VscAdd />
				</Button>
			</If>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Add Torrent</ModalHeader>
					<ModalBody>
						<Input variant={'filled'} placeholder='Magnet link' ref={input} />

						<Dropzone onDrop={onDrop}>
							{({ getRootProps, getInputProps, isDragActive }) => (
								<div className='p-2 border-dashed border-2 border-gray-600 rounded my-3'>
									<Center
										h='28'
										className={`${
											isDragActive ? 'bg-teal-700' : 'bg-gray-700'
										} rounded`}
										{...getRootProps()}
									>
										<input {...getInputProps()} />
										<span className='text-gray-400 font-semibold text-sm'>
											Drag &apos;n&apos; drop .torrent file here, or
											click to select file
										</span>
									</Center>
								</div>
							)}
						</Dropzone>
					</ModalBody>

					<ModalFooter>
						<Button mr={3} onClick={submit}>
							Add
						</Button>
						<Button variant='ghost' onClick={onClose}>
							Cancel
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
function useDropzone(arg0: { onDrop: (...args: any[]) => any }): {
	getRootProps: any;
	getInputProps: any;
	isDragActive: any;
} {
	throw new Error('Function not implemented.');
}
