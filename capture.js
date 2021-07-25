const { desktopCapturer } = require('electron')
desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
    for (const source of sources) {
        try {
            const constraints = {
                audio: {
                    mandatory: {
                        chromeMediaSource: 'desktop'
                    }
                },
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop'
                    }
                }
            }
            const stream = await navigator.mediaDevices.getUserMedia(constraints)
            handleStream(stream)
        } catch (e) {
            handleError(e)
        }
        return
    }
})

function handleStream (stream) {
    window.audiosource = stream;
}

function handleError (e) {
    alert("Unable to capture audio device\nsome devices such as USB Audio devices are not supported by chrome engine :/" + e);

}
