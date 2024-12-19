import Image from "next/image"
import loader from '../../../../_assets/images/loading_qr.png' 

async function LoadingQR() {
    return (
        <>
            
            <Image src={loader} alt='qr code loading...' width={300} height={300}/>

            <p>Your QR Code will display soon</p>
            
        </>
    )
}

export default LoadingQR