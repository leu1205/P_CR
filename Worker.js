const request = require('request');
const cheerio = require('cheerio');

function createHeader(id) {
	var options = {
		url: "https://www.pixiv.net/member_illust.php?mode=medium&illust_id=" + id,
		headers: {
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
			'Accept-charset': 'utf8',
			'Cache-Control': 'max-age=0',
			'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3',
			'Connection': 'keep-alive',
			'Cookie': 'first_visit_datetime_pc=2018-06-30+05%3A14%3A12; p_ab_id=0; p_ab_id_2=4; __utma=235335808.1517126793.1530303254.1540924964.1540963168.22; __utmz=235335808.1540924964.21.15.utmcsr=accounts.pixiv.net|utmccn=(referral)|utmcmd=referral|utmcct=/login; __utmv=235335808.|2=login%20ever=yes=1^3=plan=normal=1^5=gender=male=1^6=user_id=4707110=1^9=p_ab_id=0=1^10=p_ab_id_2=4=1^11=lang=zh_tw=1; limited_ads=%7B%22header%22%3A%22%22%2C%22responsive%22%3A%22%22%2C%22illust_responsive%22%3A%22%22%7D; tag_view_ranking=BU9SQkS-zU~tg4cf2wCF6~0xsDLqCEW6~y8GNntYHsi~RTJMXD26Ak~YtRE6tfxUU~oVetynt3hI~7ebIzNRkdM~jH0uD88V6F~_pwIgrV8TB~bXMh6mBhl8~tgP8r-gOe_~65aiw_5Y72~deLE_xfYVr~2N38QB0KJY~5trkxLyw0G~Jm23LSzAZr~G_f4j5NH8i~M2vKPRxAge~7YjK_c_EhV~mf6rICH32i~Ms9Iyj7TRt~Oa9b6mEc1T~s0bilMoGv9~-PBOOs1sNs~w3LBK6WGyo~8I2CPSy8S1~qiO14cZMBI~SJK3YcGD-h~4OtoweblrI~uusOs0ipBx~jhuUT0OJva~xFFLhECnS_~CSWO8mBKx3~cJR6OCGDV1~OxeWGr811U~yJBCOfRVm1~7zpYObBgDO~jcvzXM7oFG~zpxRZSQQmq~j2Cs25NHKk~Is0SiXyaWb~_3oeEue7S7~K9_9y8aD2T~KXfT8YWwR1~eE5ORV6KVQ~uCl78ezw0i~3Vtp7n-t0Z~_GM8SeYsYl~seobbkpcPg~RcahSSzeRf~czivFfGsI3~DssG1nZKCJ~ePN3h1AXKX~rOnsP2Q5UN~RokSaRBUGr~fafuO7KcEk~ueeKYaEKwj~Ie2c51_4Sp~G4ivgeu0mj~zyKU3Q5L4C~37s8SdOvcg~2Qj5zbG-Lf~-k3NedSQA8~rfMB-f5Ft1~gtRvCRQT8_~aQnRckP9ff~HkYBIXWvti~Uhg1g_SJrF~ccQXkT-GUM~h1GCgGEEXC~-asLU6D-hK~faHcYIP1U0~_RfiUqtsxe~iWrovDEgHB~_bee-JX46i~aLBjcKpvWL~fUS-Ay2M9Z~SqVgDNdq49~aKhT3n4RHZ~q303ip6Ui5~q3eUobDMJW~On78ko7AV6~qJrEJxX37p~AI_aJCDFn0~wDCpdm3_AP~5RxqIbZZme~fOCyT0GOnX~hdekn0BnKr~fn5nUXtjWI~CHuKGPVPZx~NpsIVvS-GF~04ihaap-18~V76Tlv7o_W~TyNqrPjCcj~V6GgaEP-Fi~lo0hog5Ml-~47vdXAvAgO~81BOcT1ZAV~2cOVLrP5HQ; privacy_policy_agreement=1; _ga=GA1.2.1517126793.1530303254; c_type=22; a_type=0; b_type=1; login_ever=yes; module_orders_mypage=%5B%7B%22name%22%3A%22sketch_live%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22tag_follow%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22recommended_illusts%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22everyone_new_illusts%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22following_new_illusts%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22mypixiv_new_illusts%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22fanbox%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22featured_tags%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22contests%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22user_events%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22sensei_courses%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22spotlight%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22booth_follow_items%22%2C%22visible%22%3Atrue%7D%5D; ki_t=1534612040520%3B1534612040520%3B1534612040520%3B1%3B1; ki_r=; _td=48b3d87c-d1ef-4500-8fc3-bbc0e5427401; yuid_b=FxdDglg; p_ab_d_id=39234866; categorized_tags=CADCYLsad0~IVwLyT8B6k~OEXgaiEbRa~RsIQe1tAR0~b8b4-hqot7; login_bc=1; _gid=GA1.2.2093870624.1540906758; device_token=6275ca0e8e533defcbf976100d43fe1f; is_sensei_service_user=1; cto_lwid=f72e8bf2-89fe-4346-a97a-fc8fd6c9fdb7; PHPSESSID=4707110_2961d991a40949bc13a6278f3880329e; __utmb=235335808.3.10.1540963168; __utmc=235335808; tags_sended=1; OX_plg=swf|shk|pm',
			'Referer': 'https://www.pixiv.net/',
			'Upgrade-Insecure-Requests': 1,
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:63.0) Gecko/20100101 Firefox/63.0'
		}
	}
	return options;
}

function rp(header) {
	return new Promise(function (resolve, reject) {
		request(header, function (error, response) {
			if (error) {
				reject(error);
			} else {
				resolve(response);
			}
		});
	});
}

async function RequestID(id) {
	let data = await rp(createHeader(id)).then(function (response) {
		if (response.statusCode == 200) {
			var data = Scrapy.get(id, response);
			return data;
		}
	}).catch(err => console.log(err));
	return data;
}

var Scrapy = {
	get: function (id, response) {
		$ = cheerio.load(response.body);
		var Likes = this.getLikes($);

		if (Likes >= 1000) {
			const data = {
				"Pixiv_id": id,
				"Title": this.getTitle($),
				"Author": this.getAuthor($),
				"Views": this.getViews($),
				"Likes": this.getLikes($),
				"Tags": this.getTags($)
			}
			return data;
		} else {
			return undefined;
		}
	},
	getTitle: function ($) {
		var title = $('h1.title').text();
		return title;
	},
	getAuthor: function ($) {
		var author = $('div.newindex h2.name a').text();
		return author;
	},
	getViews: function ($) {
		var views = $('span.views').eq(0).text();
		return views;
	},
	getLikes: function ($) {
		var likes = $('span.views').eq(1).text();
		return likes;
	},
	getTags: function ($) {
		var tags = $('li.tag a.text').map(function () { return $(this).text(); }).get().join(',');
		return tags;
	}
}

module.exports = RequestID;