package org.ftclub.cabinet.admin.item.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.dto.AdminItemHistoryDto;
import org.ftclub.cabinet.admin.dto.AdminItemHistoryPaginationDto;
import org.ftclub.cabinet.dto.ItemPurchaseCountDto;
import org.ftclub.cabinet.dto.ItemStatisticsDto;
import org.ftclub.cabinet.item.domain.Item;
import org.ftclub.cabinet.item.domain.ItemHistory;
import org.ftclub.cabinet.item.domain.ItemType;
import org.ftclub.cabinet.item.domain.Sku;
import org.ftclub.cabinet.item.service.ItemCommandService;
import org.ftclub.cabinet.item.service.ItemHistoryCommandService;
import org.ftclub.cabinet.item.service.ItemHistoryQueryService;
import org.ftclub.cabinet.item.service.ItemQueryService;
import org.ftclub.cabinet.item.service.ItemRedisService;
import org.ftclub.cabinet.mapper.ItemMapper;
import org.ftclub.cabinet.utils.lock.LockUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminItemFacadeService {

	private final ItemQueryService itemQueryService;
	private final ItemCommandService itemCommandService;
	private final ItemHistoryCommandService itemHistoryCommandService;
	private final ItemHistoryQueryService itemHistoryQueryService;
	private final ItemMapper itemMapper;

	private final ItemRedisService itemRedisService;

	@Transactional
	public void createItem(Integer Price, Sku sku, ItemType type) {
		itemCommandService.createItem(Price, sku, type);
	}

	@Transactional
	public void assignItem(List<Long> userIds, Sku sku) {
		Item item = itemQueryService.getBySku(sku);
		LocalDateTime now = null;
		if (item.getPrice() > 0) {
			now = LocalDateTime.now();
			userIds.forEach(userId -> LockUtil.lockRedisCoin(userId, () -> {
				long coinAmount = itemRedisService.getCoinAmount(userId);
				itemRedisService.saveCoinCount(userId, coinAmount + item.getPrice());

				long totalCoinSupply = itemRedisService.getTotalCoinSupply();
				itemRedisService.saveTotalCoinSupply(totalCoinSupply + item.getPrice());
			}));
		}
		itemHistoryCommandService.createItemHistories(userIds, item.getId(), now);
	}

	@Transactional(readOnly = true)
	public AdminItemHistoryPaginationDto getUserItemHistories(Long userId, Pageable pageable) {
		Page<ItemHistory> itemHistoryWithItem =
				itemHistoryQueryService.findItemHistoriesByUserIdWithItem(userId, pageable);

		List<AdminItemHistoryDto> result = itemHistoryWithItem.stream()
				.map(ih -> itemMapper.toAdminItemHistoryDto(ih, ih.getItem()))
				.collect(Collectors.toList());

		return new AdminItemHistoryPaginationDto(result, itemHistoryWithItem.getTotalElements());
	}

	@Transactional(readOnly = true)
	public ItemStatisticsDto getItemPurchaseStatistics() {
		List<Item> itemsOnSale = itemQueryService.getUseItemIds();
		List<ItemPurchaseCountDto> result = itemsOnSale.stream()
				.map(item -> {
					int userCount = itemHistoryQueryService.findPurchaseCountByItemId(item.getId());
					return itemMapper.toItemPurchaseCountDto(item, userCount);
				}).collect(Collectors.toList());

		return new ItemStatisticsDto(result);
	}
}
