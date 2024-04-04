import { navigate } from 'svelte-routing';
import { mask } from './stores';

export default function navigateEffect(link: string){
    new Promise<void>((res)=>{
        mask.set(1);
        setTimeout(()=>res(), 900)
    }).then(()=>navigate(link))
}