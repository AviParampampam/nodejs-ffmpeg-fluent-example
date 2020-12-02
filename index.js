const { join } = require('path')
const ffmpeg = require('fluent-ffmpeg')

ffmpeg()
	.input('rtsp://admin:123456@192.168.1.15:554/ch01.264?dev=1')
	.inputFormat('rtsp')
	.addInputOption('-analyzeduration 100000000'),
	.addInputOption('-probesize 100000000')
	.noAudio()
	.format('segment')
	.videoCodec('copy')
	.videoBitrate(357564416)
	.addOutputOption([
		'-crf 23',
		'-hls_flags delete_segments+append_list',
		'-segment_format mpegts',
		'-segment_wrap 8',
		'-segment_list_flags live',
		`-segment_list ${join(__dirname, 'output/list.m3u8')}`,
		'-segment_time 2',
		'-segment_list_size 4',
		'-segment_list_type m3u8',
		'-movflags frag_keyframe+empty_moov',
		'-copyts'
	])
	.output(`${join(__dirname, 'output/s%d.ts')}`)
	.on('start', (cmd) => {
		console.log('Command:', cmd)
	})
	.on('codecData', (data) => {
		console.log('Codec data:', data)
	})
	.on('progress', (progress) => {
		console.log('Progress:', progress)
	})
	.on('stderr', (stderrLine) => {
		console.log('stderrLine:', stderrLine)
	})
	.on('error', (err, stdout, stderr) => {
		console.log('Err:', err)
		console.log('Stdout:', stdout)
		console.log('Stderr:', stderr)
	})
	.on('end', (stdout, stderr) => {
		console.log('End stdout:', stdout)
		console.log('End stderr:', stderr)
	})
	.run()
