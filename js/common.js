/**
 * 
 * @param {*} str 
 * @returns 
 */
function binToAscii(str) {
    var curOut = '';
    var curBit = 0;
    var curChar = 0;

    for (var i = 0; i < str.length; i++) {
        if (str.charAt(i) == '1') {
            curChar |= 1 << curBit;
        }
        curBit++;
        if (curBit > 3) {
            curOut += curChar.toString(16);
            curChar = 0;
            curBit = 0;
        }
    }
    if (curBit > 0) {
        curOut += curChar.toString(16);
    }
    return str.length + '.' + curOut;
}

/**
 * 
 * @param {*} str 
 * @returns 
 */
function asciiToBin(str) {
    var re = /([0-9]+)\.([0-9a-f]+)/;
    var res = re.exec(str);
    var out = '';
    for (var i = 0; i < res[1]; i++) {
        var ch = parseInt(res[2].charAt(Math.floor(i / 4)), 16);
        var pos = i % 4;
        out += (ch & (1 << pos) ? '1' : '0');
    }
    return out;
}


function network_address(ip, mask) {
    for (var i = 31 - mask; i >= 0; i--) {
        ip &= ~1 << i;
    }
    return ip;
}

function subnet_addresses(mask) {
    return 1 << (32 - mask);
}

/**
 * Gets the last address available in the subnet
 * @param {*} subnet The subnet address space
 * @param {*} mask The subnet netmask
 * @returns  The last available address
 */
function subnet_last_address(subnet, mask) {
    return subnet + subnet_addresses(mask) - 1;
}

/**
 * Gets the subnet netmask
 * @param {*} mask 
 * @returns The subnet netmask
 */
function subnet_netmask(mask) {
    return network_address(0xffffffff, mask);
}

// each node is Array:
// [0] => depth of children, total number of visible children, children
function inet_ntoa(addrint) {
    return ((addrint >> 24) & 0xff) + '.' +
        ((addrint >> 16) & 0xff) + '.' +
        ((addrint >> 8) & 0xff) + '.' +
        (addrint & 0xff);
}

function inet_aton(addrstr) {
    var re = /^([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/;
    var res = re.exec(addrstr);

    if (res === null)
        return null;

    for (var i = 1; i <= 4; i++) {
        if (res[i] < 0 || res[i] > 255) {
            return null;
        }
    }

    return (res[1] << 24) | (res[2] << 16) | (res[3] << 8) | res[4];
}

/**
 * Parses the query string
 * @param {*} str 
 * @returns 
 */
function parseQueryString(str) {
    str = str ? str : location.search;
    var query = str.charAt(0) == '?' ? str.substring(1) : str;
    var args = new Object();
    if (query) {
        var fields = query.split('&');
        for (var f = 0; f < fields.length; f++) {
            var field = fields[f].split('=');
            args[unescape(field[0].replace(/\+/g, ' '))] =
                unescape(field[1].replace(/\+/g, ' '));
        }
    }
    return args;
}

//String.format decl
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}