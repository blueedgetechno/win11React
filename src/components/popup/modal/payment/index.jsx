import { Image } from "../../../../utils/general";


const listSubs = [
	{
		title:'Trial',
		for: 'Week',
		hours: 20,
		gpu: 'RTX 3060ti',
		ram: '16GB',
		price:'75k'
	},
	{
		title:'Start',
		for: 'Month',
		hours: 100,
		gpu: 'RTX 3060ti',
		ram: '16GB',
		price:'250k'
	},
	{
		title:'Standard',
		for: 'Month',
		hours: 150,
		gpu: 'RTX 3060ti',
		ram: '16GB',
		price: '300k'
	}
]
function PaymentModal({data}) {
	const {type, price, userEmail, userName} = data
	console.log(data);
	return (
	<div className="w-[320px] h-[360px] p-6">
		<ul className="list-none flex flex-col  gap-2 pb-4">
			<li>Xin chào <strong>{userName}</strong>^^, cảm ơn bạn đã quan tâm tới dịch vụ Thinkmay. </li>
			<li>Để tiến hành thanh toán gói <strong>{type}</strong>, bạn hãy chuyển khoản số tiền <strong>{price}</strong>: kèm với <strong>email</strong> dùng trong Thinkmay.</li>
			<li>Ví dụ: {userEmail || 'thienvanlea1@gmail.com'}</li>
			<Image src="asset/payment" w={'100%'} />
			<li>Sau đó <strong>chụp</strong> lại màn hình và <strong>gửi</strong> về cho <a className="underline" href="http://fb.com/thinkonmay" target="_blank" rel="noopener noreferrer">Fanpage</a> để được kiểm tra và hướng dẫn.^^ </li>
			<li>Cảm ơn bạn đã sử dụng dịch vụ của Thinkmay.</li>

		</ul>

	</div>)
}

export default PaymentModal;