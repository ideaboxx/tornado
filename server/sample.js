const fetch = require('node-fetch')
const fs = require('fs')

function getVideoType(code){
    if(code === '37')
        return { code: 37, name: '1080p' }
    else if(code === '18')
        return { code: 18, name: '360p' }
    else if(code === 22)
        return { code:22, name: '720p' }
    else
        return { code: code, name: 'unknown'}
}


const config = {
    "headers": {
        "accept": "*/*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-client-data": "CIu2yQEIo7bJAQjBtskBCKmdygEI58bKARibvsoB",
        "cookie": "ANID=OPT_OUT; SEARCH_SAMESITE=CgQI4o8B; OGP=-4061129:; OTZ=5490318_34_34__34_; DRIVE_STREAM=YG_0UwLSbgA; SID=xwfakarjYMwfpndK7UyvtMzVoW7ql70KNba9zvgrgEUcElcT0EawDUToIwf2QnKL7U5IWQ.; __Secure-3PSID=xwfakarjYMwfpndK7UyvtMzVoW7ql70KNba9zvgrgEUcElcTlsYA2hCEEE0zCeygIB-7Fw.; HSID=ARYHnLc4gBAOrET1U; SSID=AXjztjveKrR88m4OT; APISID=IZFV4iIDqUgMFEux/AYgbGfCrgbXh3KlXr; SAPISID=nDSg8A9PpyMF_ycc/ArVip_l9lQtU8uLSq; __Secure-HSID=ARYHnLc4gBAOrET1U; __Secure-SSID=AXjztjveKrR88m4OT; __Secure-APISID=IZFV4iIDqUgMFEux/AYgbGfCrgbXh3KlXr; __Secure-3PAPISID=nDSg8A9PpyMF_ycc/ArVip_l9lQtU8uLSq; NID=204=i7Rh2244umtniZeKlHgFbVS-Ek47JHfq1CtZDbF-T1Al0rtlXWq5siYakHJk5c6Ht3LYafwGLkmGvdKbECtOwP2VrzzmchBMklFRlsQBrIuILyBmVSPJ10szVfMYsESdK_SU2CEghlC0KJF6b-FJT3lfY-jEe6sHSVhjcp5J_futPAuzbT7raeD56KhRlhWhUxOm_jdLNDP00hRcM50c8hSOXHxy6MaF8qNWsx4J_kWeKWXsW_lD; 1P_JAR=2020-6-11-7; SIDCC=AJi4QfHDXCUlq-LUMhmZwcdy4Wlk0-xnfFhQ7ks9db3NQX5pD9Y319nIBPR7qQhpP_p0o85PJw"
    },
    //"referrer": "https://drive.google.com/drive/folders/1QQclGGa_e9oIIgCBOPVr2YtRNawmrVpL",
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": null,
    "method": "GET",
    "mode": "cors"
}

//["fmt_stream_map","

fetch("https://drive.google.com/file/d/1Wb8P0HTMTWk1GmPJSfUCdpH2NSSY0aPU/edit", config)
.then(res => res.text()).then((data)=>{
    const streamsRaw = data.match(/(\["fmt_stream_map",")(.)+(\])/gm)[0]
    const arr = streamsRaw.substring(19).split(',')
    let arr2 = arr.map((val)=>{
        return decodeURIComponent(JSON.parse('"'+val.replace('"]','')+'"'))
    })
    console.log(arr2)
});
/*
fetch('https://r5---sn-cvh7knes.c.drive.google.com/videoplayback?expire=1591884682&ei=SgPiXsLyNeazjATUlpW4DA&ip=117.200.146.15&cp=QVNOU0lfU1ZWQ1hOOmVPcno2Uko5cmhOdnhHWnJrYk9hYUNiVUNLZmdHd1ZobGpvNnItZUZsbFk&id=da8735d21c7d94da&itag=37&source=webdrive&requiressl=yes&mh=3l&mm=32&mn=sn-cvh7knes&ms=su&mv=m&mvi=4&pl=20&sc=yes&ttl=transient&susc=dr&driveid=1Wb8P0HTMTWk1GmPJSfUCdpH2NSSY0aPU&app=texmex&mime=video/mp4&vprv=1&prv=1&dur=5545.900&lmt=1591649456994622&mt=1591870220&sparams=expire,ei,ip,cp,id,itag,source,requiressl,ttl,susc,driveid,app,mime,vprv,prv,dur,lmt&sig=AOq0QJ8wRQIgPlZnSCHX7WcMU4MxA5n300xQtRNGrk2-wJSlJnpHCeYCIQCJj1Fcdene9vxBMqjnA0_8lQC40SFbFEDfMHjUazmmNA==&lsparams=mh,mm,mn,ms,mv,mvi,pl,sc&lsig=AG3C_xAwRgIhAOX0QpJO8MAxratM5n2vIlZuhE0NS_cl919IB2wiMw1VAiEAvaY1sp7QzSYqq_J3qt-yzWzb6tn6ZFp0A9Gm2ugi9VM=', config)
.then((resp)=>{
    console.log("writing to file")
    const file = fs.createWriteStream("sample.mp4")
    resp.body.pipe(file)
})*/


//drive.google.com/file/d/1zger4H1FR3WTQa0WAPHrI3blPhMaUNuS/edit
// 1Wb8P0HTMTWk1GmPJSfUCdpH2NSSY0aPU
// 18io1kBfWXi8ka2Ul_3DvBVw3xV3kCtKs