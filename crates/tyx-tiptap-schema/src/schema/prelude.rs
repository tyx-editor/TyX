pub use ecow::EcoString;
pub use serde::{Deserialize, Serialize};

pub use super::{TyxMark, TyxNode};
pub use crate::TyxMarked;

pub type Content = Vec<TyxNode>;
