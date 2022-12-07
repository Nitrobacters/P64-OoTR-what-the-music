var oldMusic = 0;
var oldFanfare = 0;

function hexToDec(hex)
{
	return parseInt(hex, 16);
}

function doesExist(obj, value) {
  for (var key in obj) {
    if (obj[key].value === value) {
      return obj[key].key;
    }
  }
  return false;
}

function main(isFanfare){
	var music = mem.u8[0x80128B64];
	var fanfare = mem.u8[0x801250BB];
	
	var dic = [];
	var buffer2 = new Buffer(2000);
	buffer2 = fs.readfile('./Scripts/area-music-adress.txt');
	
	var str = (buffer2+'');
	str = str.replace(/(\r||\r)/gm, "");
	var split = str.split(/\n/);
	var split2;
	for (var i = 0, len = split.length; i < len; i++) {
		split2 = split[i].split('¤');
		dic.push({
			key: split2[0],
			value: hexToDec(split2[1].replace('0x', ''))
		});
	}
	
	var exists = doesExist(dic, music);
	if(exists && !isFanfare) {
		console.log(exists);
		findMusic(exists, false);
	}
	else if(!exists && music != '01' && music != '82' && music != '102' && music != '103' && music != '104' && music != '105' && music != '106' && music != '0')
	{
		console.log(music);
		console.log('unknow');
		findMusic('unknow', false);
	}
	else if (music == '82' || music == '102')
	{
		console.log('end');
		findMusic('end', false);
	}
	else if (music == '103' || music == '104' || music == '105' ||music == '106')
	{
		console.log('credit');
		findMusic('credit', false);
	}
	else if (!isFanfare || music == '0')
	{
		console.log('no');
		findMusic('no', false);
	}
	
	var existsFanfare = doesExist(dic, fanfare);
	if (existsFanfare && isFanfare)
	{
		console.log(existsFanfare);
		findMusic(existsFanfare, true);
	}
	else if(fanfare == '255')
	{
		console.log('no fanfare');
		findMusic('no fanfare', true);
	}
}

function findMusic(placeName, isFanfare) {
	
		
	var dic2 = [];
	var buffer3 = new Buffer(2000);
	buffer3 = fs.readfile(pj64.romInfo.filePath.replace('.z64', '_Cosmetics.json'));
	var json = JSON.parse((buffer3+''));
	var str2 = JSON.stringify(json.bgm);
	var split3 = str2.split('","');
	var split4;
	for (var i = 0, len = split3.length; i < len; i++) {
		split3[i] = split3[i].replace('":"', "¤").replace('"', '').replace('}', '').replace('{', '').replace('/', '');
		split4 = split3[i].split('¤');
		dic2.push({
			key: split4[1],
			value: split4[0]
		});
	}

	var exists2 = doesExist(dic2, placeName);
	
	if(placeName != ('unknow') && placeName != ('no') && placeName != ('end') && placeName != ('credit') && !isFanfare && exists2)
	{
		console.log(exists2);
		var fd = fs.open("./Scripts/Musique Zelda Rando.txt", "wb");
		fs.write(fd, 'Music : ' + exists2);
		fs.close(fd);
	}
	else if(placeName == ('no') && !isFanfare){
		console.log('no music');
		var fd = fs.open("./Scripts/Musique Zelda Rando.txt", "wb");
		fs.write(fd, "");
		fs.close(fd);
	}
	else if (placeName == ('end') && !isFanfare)
	{
		console.log('end music');
		var fd = fs.open("./Scripts/Musique Zelda Rando.txt", "wb");
		fs.write(fd, "Music : Zelda's Lullaby");
		fs.close(fd);
	}
	else if (placeName == ('credit') && !isFanfare)
	{
		console.log('credit music');
		var fd = fs.open("./Scripts/Musique Zelda Rando.txt", "wb");
		fs.write(fd, "Music : Staff Roll");
		fs.close(fd);
	}
	else if (exists2 && isFanfare)
	{
		console.log("Fanfare : " + exists2);
		var fd = fs.open("./Scripts/Fanfare Zelda Rando.txt", "wb");
		fs.write(fd, ("Fanfare : " + exists2));
		fs.close(fd);
	}
	else if (placeName == ('no fanfare') && isFanfare)
	{
		console.log("no Fanfare");
		var fd = fs.open("./Scripts/Fanfare Zelda Rando.txt", "wb");
		fs.write(fd, (""));
		fs.close(fd);
	}
	else {
		console.log('unknow music');
		var fd = fs.open("./Scripts/Musique Zelda Rando.txt", "wb");
		fs.write(fd, "Not found");
		fs.close(fd);
	}
	
}

function checker() {
	
	var musicChecker = mem.u8[0x80128B64];
	var fanfareChecker = mem.u8[0x801250BB];
	
	if(oldMusic != musicChecker)
	{
		console.log("False");
		oldMusic = musicChecker;
		main(false);
	}
	else if(oldFanfare != fanfareChecker)
	{
		console.log("True");
		oldFanfare = fanfareChecker;
		main(true);
		setTimeout(removeFanfare, 10000);
	}
	
}

function removeFanfare() {
	console.log("Remove Fanfare");
	var fd = fs.open("./Scripts/Fanfare Zelda Rando.txt", "wb");
	fs.write(fd, (""));
	fs.close(fd);
}
setInterval(checker, 50);



events.onstatechange(function(e) {
    if (e.state == 1)
	{	
		console.log("Closing");
		var fd = fs.open("./Scripts/Fanfare Zelda Rando.txt", "wb");
		fs.write(fd, (""));
		fs.close(fd);
		var fd = fs.open("./Scripts/Musique Zelda Rando.txt", "wb");
		fs.write(fd, "");
		fs.close(fd);
	}
});

script.keepalive(true);