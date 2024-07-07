"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpServer = exports.app = void 0;
exports.sendMessage = sendMessage;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ffi_napi_1 = __importDefault(require("ffi-napi"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const openhardwaremonitor_service_1 = require("../../application/services/openhardwaremonitor.service");
const steam_services_1 = require("../../application/services/steam.services");
const routes_1 = __importDefault(require("../../config/routes"));
require('dotenv').config();
const app = (0, express_1.default)();
exports.app = app;
const httpServer = http_1.default.createServer(app);
exports.httpServer = httpServer;
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.static('public'));
const steamPath = path_1.default.join(process.env['ProgramFiles(x86)'], 'Steam');
const imagesFolder = path_1.default.join(steamPath, 'appcache', 'librarycache');
app.use('/images', express_1.default.static(imagesFolder));
app.use('/api/', routes_1.default);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
    },
});
const user32 = new ffi_napi_1.default.Library('user32', {
    MessageBoxW: ['int32', ['int32', 'string', 'string', 'uint32']],
});
const MB_YESNO = 0x00000004;
const MB_ICONQUESTION = 0x00000020;
const IDYES = 6;
const IDNO = 7;
io.on('connection', (socket) => {
    console.log(`user conected on id ${socket.id}`);
    socket.on('rungame', (data) => {
        (0, steam_services_1.runSteamGame)(data).then((res) => socket.emit('recentupdate', res));
    });
    socket.on('shutdown', () => {
        const message = 'Are you sure you want to shutdown the system?';
        const title = 'Confirm Shutdown';
        const messageBuffer = Buffer.from(message, 'utf16le');
        const titleBuffer = Buffer.from(title, 'utf16le');
        const response = user32.MessageBoxW(0, messageBuffer, titleBuffer, MB_YESNO | MB_ICONQUESTION);
        if (response === IDYES) {
            // runShutdown();
            console.log('desligou');
        }
        else {
            console.log('canceled.');
        }
    });
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        (0, openhardwaremonitor_service_1.getCompleteHardwareInfo)().then((hardwareInfo) => socket.emit('hardware-info', hardwareInfo));
    }), 500);
    socket.on('disconnect', () => {
        console.log(`User disconnected with id ${socket.id}`);
    });
});
io.on('disconnect', (socket) => {
    console.log(`user ${socket.id} disconnected`);
});
function sendMessage(event, value) {
    io.emit(event, value);
}
