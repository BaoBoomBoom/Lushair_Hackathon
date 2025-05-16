[⚠️ Suspicious Content] // Comprehensive Solana Smart Contract for HAIR Points Incentive System
// Using Anchor framework

use anchor_lang::prelude::*;

// Declare program ID
declare_id!("6yvVzXaA1FahujqSnKWMJcnVihom3Usci3dsfRDiPhQ7");

#[program]
pub mod genpulse {
    use super::*;

    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        let reward_account = &mut ctx.accounts.reward_account;
        reward_account.user = ctx.accounts.user.key();
        reward_account.points = 0;
        reward_account.joined_community = false;
        reward_account.browse_complete = false;
        reward_account.is_first_login = true;
        reward_account.used_microscope = false;
        reward_account.seven_day_streak = 0;
        reward_account.last_login_day = 0;
        reward_account.last_camera_day = 0;
        reward_account.last_microscope_day = 0;
        reward_account.weekly_microscope_count = 0;
        Ok(())
    }

    pub fn reward_action(
        ctx: Context<RewardAction>,
        category: Category,
        current_day: u64,
    ) -> Result<()> {
        let reward_account = &mut ctx.accounts.reward_account;

        let reward = match category {
            Category::FirstMicroscopeUse => {
                require!(!reward_account.used_microscope, ErrorCode::AlreadyUsed);
                reward_account.used_microscope = true;
                200
            }
            Category::RoutineMicroscope => {
                require!(
                    current_day != reward_account.last_microscope_day,
                    ErrorCode::DailyLimitExceeded
                );
                reward_account.last_microscope_day = current_day;
                reward_account.weekly_microscope_count += 1;
                100
            }
            Category::ThreeMicroscopeWeekly => {
                require!(
                    reward_account.weekly_microscope_count >= 3,
                    ErrorCode::WeeklyTargetNotMet
                );
                reward_account.weekly_microscope_count = 0;
                50
            }
            Category::CameraDetection => {
                require!(
                    current_day != reward_account.last_camera_day,
                    ErrorCode::DailyLimitExceeded
                );
                reward_account.last_camera_day = current_day;
                30
            }
            Category::DailyHairCare => {
                // Record product usage simulated by accepting action
                10
            }
            Category::SevenDayHairCare => {
                require!(
                    reward_account.seven_day_streak == 7,
                    ErrorCode::WeeklyTargetNotMet
                );
                reward_account.seven_day_streak = 0;
                30
            }
            Category::JoinCommunity => {
                require!(!reward_account.joined_community, ErrorCode::AlreadyJoined);
                reward_account.joined_community = true;
                10
            }
            Category::SocialShare => {
                require!(reward_account.browse_complete, ErrorCode::BrowseRequirement);
                20
            }
            Category::Login => {
                require!(
                    current_day != reward_account.last_login_day,
                    ErrorCode::DailyLimitExceeded
                );
                reward_account.last_login_day = current_day;

                if reward_account.is_first_login {
                    reward_account.is_first_login = false;
                }

                reward_account.seven_day_streak += 1;
                5
            }
            Category::InviteFriend => 50,
            Category::FriendPurchase => 200,
        };

        reward_account.points += reward;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + std::mem::size_of::<RewardAccount>(),
        seeds = [b"user", user.key().as_ref()],
        bump
    )]
    pub reward_account: Account<'info, RewardAccount>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RewardAction<'info> {
    #[account(mut, seeds = [b"user", user.key().as_ref()], bump)]
    pub reward_account: Account<'info, RewardAccount>,
    pub user: Signer<'info>,
}

#[account]
pub struct RewardAccount {
    pub user: Pubkey,
    pub points: u64,
    pub joined_community: bool,
    pub browse_complete: bool,
    pub is_first_login: bool,
    pub used_microscope: bool,
    pub seven_day_streak: u8,
    pub last_login_day: u64,
    pub last_camera_day: u64,
    pub last_microscope_day: u64,
    pub weekly_microscope_count: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum Category {
    FirstMicroscopeUse,
    RoutineMicroscope,
    ThreeMicroscopeWeekly,
    CameraDetection,
    DailyHairCare,
    SevenDayHairCare,
    JoinCommunity,
    SocialShare,
    Login,
    InviteFriend,
    FriendPurchase,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Daily limit exceeded for this activity.")]
    DailyLimitExceeded,

    #[msg("User has already joined community.")]
    AlreadyJoined,

    #[msg("Social share requires +100 browse prerequisite.")]
    BrowseRequirement,

    #[msg("This first-time reward has already been claimed.")]
    AlreadyUsed,

    #[msg("Weekly reward condition not met.")]
    WeeklyTargetNotMet,
}
