"use client"; import { Share2 } from "lucide-react";
export function ShareButton(){async function share(){if(navigator.share)await navigator.share({title:document.title,url:location.href});else await navigator.clipboard.writeText(location.href)} return <button className="circle-action" onClick={share} aria-label="Compartilhar"><Share2/></button>}
