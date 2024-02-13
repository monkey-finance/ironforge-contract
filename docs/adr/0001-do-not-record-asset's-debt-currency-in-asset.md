# 1. do not record asset's debt currency in asset

Date: 2021-07-23

## Status

2021-07-23 proposed

## Context

1. we should support multi currencies to collate
2. we record creator's debt in debt system
3. we should give an interface to show how many collateral currencies to create an asset

## Decision

1. we record creator's debt in debt system with currency
2. we record how many collateral currencies to create an asset in asset itself
3. IAsset interface has similar with erc20

## Consequences
```
@startuml
用户 -> CollateralSystem: stakeAndBuildMax
CollateralSystem -> CollateralSystem: _collateral(msg.sender, stakeCurrency, stakeAmount)
CollateralSystem -> BuildBurnSystem : buildMaxFromCollateralSys(msg.sender, stakeCurrency)
activate BuildBurnSystem 
BuildBurnSystem -> BuildBurnSystem: buildMaxFromCollateralSys
activate BuildBurnSystem 
BuildBurnSystem-> BuildBurnSystem:_buildMaxAsset(user, _currency)
BuildBurnSystem-> BuildBurnSystem:MaxCanBuildAsset(user, _currency),maxCanBuild
    activate BuildBurnSystem
    BuildBurnSystem-> IConfig:getUint(BUILD_RATIO)
    IConfig-> BuildBurnSystem:buildRatio
    BuildBurnSystem-> CollateralSystem:getFreeCollateralInUsd(user, _currency)
        activate CollateralSystem
        CollateralSystem->CollateralSystem:getUserTotalCollateralInUsd(user)
        activate CollateralSystem
        CollateralSystem->IPrices:getPrice(currency)
        IPrices->CollateralSystem:Price
        deactivate CollateralSystem
        CollateralSystem->DebtSystem:GetUserDebtBalanceInUsd(_user, _currency)
            DebtSystem->AssetSystem:totalAssetsInUsd
            activate AssetSystem
                loop mAssetList.length
                AssetSystem->IPrices:getPrice
                IPrices->AssetSystem:Price
                end
            deactivate AssetSystem
            AssetSystem->DebtSystem:total
        DebtSystem->CollateralSystem:(userDebtBalance, totalAssetSupplyInUsd)
    CollateralSystem->BuildBurnSystem:maxCanBuild
    deactivate BuildBurnSystem
BuildBurnSystem-> BuildBurnSystem:_buildAsset(user, max, _currency)
    activate BuildBurnSystem
    BuildBurnSystem->IConfig:getUint(mConfig.BUILD_RATIO())
    IConfig->BuildBurnSystem:buildRatio
    BuildBurnSystem->CollateralSystem:getFreeCollateralInUsd(user, _currency)
    CollateralSystem->BuildBurnSystem:maxCanBuild
    BuildBurnSystem->DebtSystem:GetUserDebtBalanceInUsd(user, _currency)
    DebtSystem->BuildBurnSystem: (uint256 oldUserDebtBalance, uint256 totalAssetSupplyInUsd) 
    BuildBurnSystem->DebtSystem:UpdateDebt(user, newUserDebtProportion, oldTotalProportion, _currency)
    BuildBurnSystem->IAsset:FUSDToken.mint(user, amount);
    deactivate BuildBurnSystem

@enduml
```
Consequences here...
