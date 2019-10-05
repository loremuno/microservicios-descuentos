import { Module, HttpModule, HttpService } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Module({
    imports: [
        HttpModule,
    ],
    providers: [AuthGuard],
    exports: [],
})
export class AuthModule { }